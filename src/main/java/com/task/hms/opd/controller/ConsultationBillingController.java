package com.task.hms.opd.controller;

import com.task.hms.billing.model.Bill;
import com.task.hms.opd.service.ConsultationBillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/opd/consultation-billing")
public class ConsultationBillingController {
    @Autowired
    private ConsultationBillingService consultationBillingService;

    /**
     * Generate a Bill from a Consultation's prescribed medicines.
     * @param consultationId the consultation ID
     * @return the created Bill
     */
    @PostMapping("/generate-bill/{consultationId}")
    public ResponseEntity<Bill> generateBill(@PathVariable Long consultationId) {
        Bill bill = consultationBillingService.generateBillFromConsultation(consultationId);
        return ResponseEntity.ok(bill);
    }
}
