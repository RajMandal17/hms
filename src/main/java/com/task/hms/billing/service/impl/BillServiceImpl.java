package com.task.hms.billing.service.impl;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.InsuranceClaim;
import com.task.hms.billing.model.BillingSummary;
import com.task.hms.billing.repository.BillRepository;
import com.task.hms.billing.repository.PaymentRepository;
import com.task.hms.billing.repository.InsuranceClaimRepository;
import com.task.hms.billing.repository.BillItemRepository;
import com.task.hms.billing.service.BillService;
import com.task.hms.ipd.model.IPDAdmission;
import com.task.hms.ipd.model.IPDPrescription;
import com.task.hms.ipd.repository.IPDAdmissionRepository;
import com.task.hms.ipd.repository.IPDPrescriptionRepository;
import com.task.hms.pharmacy.model.PharmacySale;
import com.task.hms.pharmacy.repository.PharmacySaleRepository;
import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.model.WalkInPatient;
import com.task.hms.billing.repository.WalkInPatientRepository;
import com.task.hms.billing.dto.BillDTO;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private InsuranceClaimRepository insuranceClaimRepository;
    @Autowired
    private BillItemRepository billItemRepository;
    @Autowired
    private IPDAdmissionRepository ipdAdmissionRepository;
    @Autowired
    private IPDPrescriptionRepository ipdPrescriptionRepository;
    @Autowired
    private PharmacySaleRepository pharmacySaleRepository;
    @Autowired
    private WalkInPatientRepository walkInPatientRepository;
    @Autowired
    private PatientRepository patientRepository;

    @Override
    public BillingSummary getBillingSummary() {
        List<Bill> bills = billRepository.findAll();
        double totalRevenue = bills.stream().mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0).sum();
        double totalPaid = bills.stream().mapToDouble(b -> b.getPaidAmount() != null ? b.getPaidAmount() : 0.0).sum();
        double totalUnpaid = totalRevenue - totalPaid;
        int billCount = bills.size();
        return new BillingSummary(totalRevenue, totalPaid, totalUnpaid, billCount);
    }

    @Override
    public List<Bill> getPendingBills() {
        return billRepository.findByStatus("PENDING");
    }

    @Override
    public Bill createBill(Bill bill) {
        // If walk-in, save WalkInPatient and set walkInPatientId
        if (bill.getPatientId() == null && bill.getWalkInPatient() != null) {
            WalkInPatient walkIn = bill.getWalkInPatient();
            walkIn = walkInPatientRepository.save(walkIn);
            bill.setWalkInPatientId(walkIn.getId());
        }
        return billRepository.save(bill);
    }

    @Override
    public Bill getBillById(Long id) {
        return billRepository.findById(id).orElse(null);
    }

    @Override
    public Payment makePayment(Long billId, Payment payment) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        payment.setBill(bill);
        paymentRepository.save(payment);
        // Update paid amount and status
        double totalPaid = bill.getPayments() != null ? bill.getPayments().stream().mapToDouble(Payment::getAmount).sum() : 0.0;
        totalPaid += payment.getAmount();
        bill.setPaidAmount(totalPaid);
        bill.setStatus(totalPaid >= bill.getTotalAmount() ? "PAID" : "PARTIAL");
        billRepository.save(bill);
        return payment;
    }

    @Override
    public InsuranceClaim claimInsurance(Long billId, InsuranceClaim claim) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        claim.setBill(bill);
        return insuranceClaimRepository.save(claim);
    }

    @Override
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @Override
    public Bill addBillItem(Long billId, com.task.hms.billing.model.BillItem item) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        item.setBill(bill);
        billItemRepository.save(item);
        // Update total amount
        double total = bill.getItems() != null ? bill.getItems().stream().mapToDouble(i -> i.getAmount() != null ? i.getAmount() : 0.0).sum() : 0.0;
        total += item.getAmount() != null ? item.getAmount() : 0.0;
        bill.setTotalAmount(total);
        return billRepository.save(bill);
    }

    @Override
    public Bill getConsolidatedIPDBill(Long admissionId) {
        Optional<IPDAdmission> admissionOpt = ipdAdmissionRepository.findById(admissionId);
        if (admissionOpt.isEmpty()) return null;
        IPDAdmission admission = admissionOpt.get();
        List<BillItem> items = new ArrayList<>();
        double total = 0.0;
        // Room/bed charge (example: 1000 per day)
        if (admission.getAdmissionDate() != null && admission.getDischargeDate() != null) {
            long days = java.time.Duration.between(admission.getAdmissionDate(), admission.getDischargeDate()).toDays();
            if (days == 0) days = 1;
            double roomCharge = days * 1000.0;
            BillItem roomItem = new BillItem();
            roomItem.setDescription("Room Charges (" + days + " days)");
            roomItem.setAmount(roomCharge);
            roomItem.setSourceType("ROOM");
            roomItem.setSourceId(admissionId);
            items.add(roomItem);
            total += roomCharge;
        }
        // IPD Prescriptions (medicines, not costed here, but can be extended)
        List<IPDPrescription> prescriptions = ipdPrescriptionRepository.findByIpdAdmissionId(admissionId);
        for (IPDPrescription pres : prescriptions) {
            BillItem presItem = new BillItem();
            presItem.setDescription("IPD Prescription #" + pres.getId());
            presItem.setAmount(200.0); // Example: flat fee per prescription
            presItem.setSourceType("PRESCRIPTION");
            presItem.setSourceId(pres.getId());
            items.add(presItem);
            total += 200.0;
        }
        // Pharmacy sales for this patient during admission
        List<PharmacySale> sales = pharmacySaleRepository.findAll();
        for (PharmacySale sale : sales) {
            if (sale.getPatientId() != null && sale.getPatientId().equals(admission.getPatientId()) &&
                    sale.getDate() != null &&
                    !sale.getDate().isBefore(admission.getAdmissionDate()) &&
                    (admission.getDischargeDate() == null || !sale.getDate().isAfter(admission.getDischargeDate()))) {
                BillItem saleItem = new BillItem();
                saleItem.setDescription("Pharmacy Sale #" + sale.getId());
                saleItem.setAmount(sale.getTotalAmount() != null ? sale.getTotalAmount() : 0.0);
                saleItem.setSourceType("PHARMACY");
                saleItem.setSourceId(sale.getId());
                items.add(saleItem);
                total += saleItem.getAmount();
            }
        }
        Bill bill = new Bill();
        bill.setPatientId(admission.getPatientId());
        bill.setBillType("IPD");
        bill.setTotalAmount(total);
        bill.setPaidAmount(0.0);
        bill.setStatus("DRAFT");
        bill.setItems(items);
        return bill;
    }

    @Override
    public Bill finalizeConsolidatedIPDBill(Long admissionId) {
        Bill draft = getConsolidatedIPDBill(admissionId);
        if (draft == null) return null;
        draft.setStatus("FINALIZED");
        Bill saved = billRepository.save(draft);
        for (BillItem item : draft.getItems()) {
            item.setBill(saved);
            billItemRepository.save(item);
        }
        return saved;
    }

    @Override
    public List<BillDTO> getAllBillsAsDTO() {
        List<Bill> bills = billRepository.findAll();
        List<BillDTO> dtos = new ArrayList<>();
        for (Bill bill : bills) {
            String patientName = null;
            if (bill.getPatientId() != null) {
                Patient patient = patientRepository.findById(bill.getPatientId()).orElse(null);
                if (patient != null) patientName = patient.getName();
            } else if (bill.getWalkInPatientId() != null) {
                WalkInPatient walkIn = walkInPatientRepository.findById(bill.getWalkInPatientId()).orElse(null);
                if (walkIn != null) patientName = walkIn.getName();
            }
            dtos.add(new BillDTO(
                bill.getId(),
                patientName,
                bill.getBillType(),
                bill.getTotalAmount(),
                bill.getPaidAmount(),
                bill.getStatus(),
                bill.getItems(),
                bill.getPayments(),
                bill.getInsuranceClaim()
            ));
        }
        return dtos;
    }
}
