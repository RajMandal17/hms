package com.task.hms.billing.service;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.model.Payment;
import java.util.List;

public interface BillService {
    Bill createBill(Long patientId, String billType);
    Bill addBillItem(Long billId, BillItem item);
    Bill removeBillItem(Long billId, Long itemId);
    Bill finalizeBill(Long billId);
    Bill getBill(Long billId);
    List<Bill> getBillsByPatient(Long patientId);
    Payment addPayment(Long billId, Payment payment);
    List<Bill> getAllBills();
    Bill getConsolidatedIPDBill(Long admissionId);
    Bill finalizeConsolidatedIPDBill(Long admissionId);
    Bill finalizeConsolidatedIPDBill(Long admissionId, List<BillItem> customItems);
    List<Bill> getPendingBills();
    List<Bill> getPendingBillsByPatient(Long patientId);
}
