package com.task.hms.billing.service.impl;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.FeeAndCharge;
import com.task.hms.billing.model.Refund;
import com.task.hms.billing.repository.BillRepository;
import com.task.hms.billing.repository.BillItemRepository;
import com.task.hms.billing.repository.FeeAndChargeRepository;
import com.task.hms.billing.repository.PaymentRepository;
import com.task.hms.billing.repository.RefundRepository;
import com.task.hms.billing.service.BillService;
import com.task.hms.ipd.model.IPDAdmission;
import com.task.hms.ipd.model.IPDPrescription;
import com.task.hms.ipd.repository.IPDAdmissionRepository;
import com.task.hms.ipd.repository.IPDPrescriptionRepository;
import com.task.hms.pharmacy.model.PharmacySale;
import com.task.hms.pharmacy.repository.PharmacySaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private BillItemRepository billItemRepository;
    @Autowired
    private FeeAndChargeRepository feeAndChargeRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private IPDAdmissionRepository ipdAdmissionRepository;
    @Autowired
    private IPDPrescriptionRepository ipdPrescriptionRepository;
    @Autowired
    private PharmacySaleRepository pharmacySaleRepository;

    @Override
    public Bill createBill(Long patientId, String billType) {
        Bill bill = new Bill();
        bill.setPatientId(patientId);
        bill.setBillType(billType);
        bill.setStatus("PENDING");
        bill.setTotalAmount(0.0);
        bill.setPaidAmount(0.0);
        return billRepository.save(bill);
    }

    @Override
    public Bill addBillItem(Long billId, BillItem item) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        // Ensure custom/manual items have sourceType set
        if (item.getSourceType() == null || item.getSourceType().trim().isEmpty()) {
            item.setSourceType("CUSTOM");
            item.setSourceId(billId);
        }
        item.setBill(bill);
        billItemRepository.save(item);
        List<BillItem> items = billItemRepository.findAll();
        double total = items.stream().filter(i -> i.getBill().getId().equals(billId)).mapToDouble(i -> i.getAmount() != null ? i.getAmount() : 0.0).sum();
        bill.setTotalAmount(total);
        return billRepository.save(bill);
    }

    @Override
    public Bill removeBillItem(Long billId, Long itemId) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        billItemRepository.deleteById(itemId);
        List<BillItem> items = billItemRepository.findAll();
        double total = items.stream().filter(i -> i.getBill().getId().equals(billId)).mapToDouble(i -> i.getAmount() != null ? i.getAmount() : 0.0).sum();
        bill.setTotalAmount(total);
        return billRepository.save(bill);
    }

    @Override
    public Bill finalizeBill(Long billId) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        bill.setStatus("FINALIZED");
        return billRepository.save(bill);
    }

    @Override
    public Bill getBill(Long billId) {
        return billRepository.findById(billId).orElse(null);
    }

    @Override
    public List<Bill> getBillsByPatient(Long patientId) {
        return billRepository.findAll().stream().filter(b -> b.getPatientId().equals(patientId)).toList();
    }

    @Override
    public Payment addPayment(Long billId, Payment payment) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) return null;
        payment.setBill(bill);
        paymentRepository.save(payment);
        double paid = paymentRepository.findAll().stream().filter(p -> p.getBill().getId().equals(billId)).mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0).sum();
        bill.setPaidAmount(paid);
        if (paid >= bill.getTotalAmount()) bill.setStatus("PAID");
        billRepository.save(bill);
        return payment;
    }

    @Override
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // Consolidated IPD Bill: preview (does not persist)
    @Override
    public Bill getConsolidatedIPDBill(Long admissionId) {
        IPDAdmission admission = ipdAdmissionRepository.findById(admissionId).orElse(null);
        if (admission == null) return null;
        ArrayList<BillItem> items = new ArrayList<>();
        double total = 0.0;
        // Room charges
        Double roomFee = feeAndChargeRepository.findByType("ROOM").map(FeeAndCharge::getAmount).orElse(1000.0);
        if (admission.getAdmissionDate() != null && admission.getDischargeDate() != null) {
            long days = Duration.between(admission.getAdmissionDate(), admission.getDischargeDate()).toDays();
            if (days == 0) days = 1;
            double roomCharge = days * roomFee;
            BillItem roomItem = new BillItem();
            roomItem.setDescription("Room Charges (" + days + " days)");
            roomItem.setAmount(roomCharge);
            roomItem.setSourceType("ROOM");
            roomItem.setSourceId(admissionId);
            items.add(roomItem);
            total += roomCharge;
        }
        // Consultation fee
        Double consultFee = feeAndChargeRepository.findByType("CONSULTATION").map(FeeAndCharge::getAmount).orElse(500.0);
        if (admission.getDoctorId() != null) {
            BillItem consultItem = new BillItem();
            consultItem.setDescription("Consultation Fee");
            consultItem.setAmount(consultFee);
            consultItem.setSourceType("CONSULTATION");
            consultItem.setSourceId(admission.getDoctorId());
            items.add(consultItem);
            total += consultFee;
        }
        // IPD Prescriptions
        Double prescriptionFee = feeAndChargeRepository.findByType("PRESCRIPTION").map(FeeAndCharge::getAmount).orElse(200.0);
        for (IPDPrescription pres : ipdPrescriptionRepository.findAll()) {
            if (pres.getIpdAdmissionId().equals(admissionId)) {
                BillItem presItem = new BillItem();
                presItem.setDescription("IPD Prescription #" + pres.getId());
                presItem.setAmount(prescriptionFee);
                presItem.setSourceType("PRESCRIPTION");
                presItem.setSourceId(pres.getId());
                items.add(presItem);
                total += prescriptionFee;
            }
        }
        // Pharmacy sales during admission
        for (PharmacySale sale : pharmacySaleRepository.findAll()) {
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
        bill.setStatus("PENDING");
        bill.setItems(items);
        return bill;
    }

    @Override
    public Bill finalizeConsolidatedIPDBill(Long admissionId, List<BillItem> customItems) {
        Bill draft = getConsolidatedIPDBill(admissionId);
        if (draft == null) return null;
        // Add custom items if provided
        if (customItems != null && !customItems.isEmpty()) {
            for (BillItem item : customItems) {
                // Ensure custom/manual items have sourceType set
                if (item.getSourceType() == null || item.getSourceType().trim().isEmpty()) {
                    item.setSourceType("CUSTOM");
                }
                item.setBill(draft);
                draft.getItems().add(item);
            }
        }
        // Recalculate total
        double total = draft.getItems().stream().mapToDouble(i -> i.getAmount() != null ? i.getAmount() : 0.0).sum();
        draft.setTotalAmount(total);
        draft.setStatus("PENDING");
        Bill saved = billRepository.save(draft);
        for (BillItem item : draft.getItems()) {
            item.setBill(saved);
            billItemRepository.save(item);
        }
        return saved;
    }

    @Override
    public Bill finalizeConsolidatedIPDBill(Long admissionId) {
        return finalizeConsolidatedIPDBill(admissionId, null);
    }

    @Override
    public List<Bill> getPendingBills() {
        return billRepository.findAll().stream()
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus()))
                .toList();
    }

    @Override
    public List<Bill> getPendingBillsByPatient(Long patientId) {
        return billRepository.findAll().stream()
                .filter(b -> b.getPatientId() != null && b.getPatientId().equals(patientId))
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus()))
                .toList();
    }

    @Override
    public void refundBill(Long billId, Double amount, String reason, String processedBy) {
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null) throw new IllegalArgumentException("Bill not found");
        if (amount == null || amount <= 0) throw new IllegalArgumentException("Invalid refund amount");
        if (bill.getPaidAmount() == null || bill.getPaidAmount() < amount) throw new IllegalArgumentException("Refund amount exceeds paid amount");
        Refund refund = new Refund();
        refund.setBill(bill);
        refund.setAmount(amount);
        refund.setReason(reason);
        refund.setRefundedAt(java.time.LocalDateTime.now());
        refund.setStatus("PROCESSED");
        refundRepository.save(refund);
        double newPaidAmount = bill.getPaidAmount() - amount;
        bill.setPaidAmount(newPaidAmount);
        if (newPaidAmount <= 0) {
            bill.setStatus("REFUNDED");
        } else if (bill.getTotalAmount() != null && newPaidAmount < bill.getTotalAmount()) {
            bill.setStatus("PARTIALLY_PAID");
        }
        billRepository.save(bill);
    }
}
