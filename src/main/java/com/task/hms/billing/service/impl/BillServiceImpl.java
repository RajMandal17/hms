// Removed misplaced duplicate getPendingBills method at file top
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
}
