package com.task.hms.billing.controller;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillService billService;

    // ...existing endpoints...

    @GetMapping("/ipd/consolidated/{admissionId}")
    public ResponseEntity<Bill> getConsolidatedIPDBill(@PathVariable Long admissionId) {
        Bill bill = billService.getConsolidatedIPDBill(admissionId);
        if (bill == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(bill);
    }

    @PostMapping("/ipd/consolidated/{admissionId}/finalize")
    public ResponseEntity<Bill> finalizeConsolidatedIPDBill(
            @PathVariable Long admissionId,
            @RequestBody(required = false) java.util.List<BillItem> customItems) {
        Bill bill = billService.finalizeConsolidatedIPDBill(admissionId, customItems);
        if (bill == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/bills/patient/{patientId}")
    public ResponseEntity<java.util.List<Bill>> getBillsByPatient(@PathVariable Long patientId) {
        java.util.List<Bill> bills = billService.getBillsByPatient(patientId);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/bills/pending")
    public ResponseEntity<java.util.List<Bill>> getPendingBills(@RequestParam(value = "patientId", required = false) Long patientId) {
        java.util.List<Bill> pendingBills;
        if (patientId != null) {
            pendingBills = billService.getPendingBillsByPatient(patientId);
        } else {
            pendingBills = billService.getPendingBills();
        }
        return ResponseEntity.ok(pendingBills);
    }

    @GetMapping("/bills")
    public ResponseEntity<java.util.List<Bill>> getAllBills() {
        java.util.List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
    }
}