package com.task.hms.opd.service;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.repository.BillRepository;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultationBillingService {
    @Autowired
    private ConsultationRepository consultationRepository;
    @Autowired
    private BillRepository billRepository;

    /**
     * Generate a Bill from a Consultation's prescribed medicines.
     * @param consultationId the consultation ID
     * @return the created Bill
     */
    @Transactional
    public Bill generateBillFromConsultation(Long consultationId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        Bill bill = new Bill();
        bill.setPatientId(consultation.getAppointmentId()); // or use actual patientId if available
        bill.setBillType("OPD");
        bill.setStatus("PENDING");

        List<BillItem> billItems = new ArrayList<>();
        for (BillItem med : consultation.getMedicines()) {
            BillItem item = new BillItem();
            item.setDescription(med.getDescription());
            item.setAmount(med.getAmount());
            item.setSourceType(med.getSourceType());
            item.setSourceId(med.getSourceId());
            item.setBill(bill);
            billItems.add(item);
        }
        bill.setItems(billItems);
        bill.setTotalAmount(
                billItems.stream().mapToDouble(BillItem::getAmount).sum()
        );

        return billRepository.save(bill);
    }
}
