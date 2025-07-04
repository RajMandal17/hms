package com.task.hms.billing.service.impl;

import com.task.hms.billing.exception.RefundException;
import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.Refund;
import com.task.hms.billing.model.RefundAuditLog;
import com.task.hms.billing.repository.BillRepository;
import com.task.hms.billing.repository.RefundAuditLogRepository;
import com.task.hms.billing.repository.RefundRepository;
import com.task.hms.billing.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RefundServiceImpl implements RefundService {
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private RefundAuditLogRepository refundAuditLogRepository;

    @Override
    public Refund processRefund(Long billId, Double amount, String reason, String processedBy) {
        Bill bill = billRepository.findById(billId).orElseThrow(() -> new RefundException("Bill not found"));
        if (amount <= 0 || amount > (bill.getPaidAmount() != null ? bill.getPaidAmount() : 0)) {
            throw new RefundException("Invalid refund amount");
        }
        Refund refund = new Refund();
        refund.setBill(bill);
        refund.setAmount(amount);
        refund.setReason(reason);
        refund.setProcessedBy(processedBy);
        refund.setProcessedAt(LocalDateTime.now());
        refund.setStatus("COMPLETED");
        // Update bill paidAmount
        bill.setPaidAmount((bill.getPaidAmount() != null ? bill.getPaidAmount() : 0) - amount);
        billRepository.save(bill);
        Refund savedRefund = refundRepository.save(refund);
        // Audit log
        RefundAuditLog audit = new RefundAuditLog();
        audit.setRefundId(savedRefund.getId());
        audit.setAction("CREATED");
        audit.setPerformedBy(processedBy);
        audit.setPerformedAt(LocalDateTime.now());
        audit.setDetails("Refund of amount " + amount + " for bill " + billId);
        refundAuditLogRepository.save(audit);
        return savedRefund;
    }

    @Override
    public List<Refund> getRefundsByBill(Long billId) {
        return refundRepository.findByBillId(billId);
    }

    @Override
    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }
}
