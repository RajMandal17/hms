package com.task.hms.billing.service;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.InsuranceClaim;
import com.task.hms.billing.model.BillingSummary;
import java.util.List;

public interface BillService {
    Bill createBill(Bill bill);
    Bill getBillById(Long id);
    Payment makePayment(Long billId, Payment payment);
    InsuranceClaim claimInsurance(Long billId, InsuranceClaim claim);
    List<Bill> getAllBills();
    Bill addBillItem(Long billId, com.task.hms.billing.model.BillItem item);
    List<Bill> getPendingBills();
    BillingSummary getBillingSummary();
    Bill getConsolidatedIPDBill(Long admissionId);
    Bill finalizeConsolidatedIPDBill(Long admissionId);
}
