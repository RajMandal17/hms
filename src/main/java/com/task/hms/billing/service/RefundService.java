package com.task.hms.billing.service;

import com.task.hms.billing.model.Refund;
import java.util.List;

public interface RefundService {
    Refund processRefund(Long billId, Double amount, String reason, String processedBy);
    List<Refund> getRefundsByBill(Long billId);
    List<Refund> getAllRefunds();
}
