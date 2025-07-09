package com.task.hms.billing.controller;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            @RequestBody(required = false) List<BillItem> customItems) {
        Bill bill = billService.finalizeConsolidatedIPDBill(admissionId, customItems);
        if (bill == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/bills/patient/{patientId}")
    public ResponseEntity<List<Bill>> getBillsByPatient(@PathVariable Long patientId) {
        List<Bill> bills = billService.getBillsByPatient(patientId);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/bills/pending")
    public ResponseEntity<List<Bill>> getPendingBills(@RequestParam(value = "patientId", required = false) Long patientId) {
        List<Bill> pendingBills;
        if (patientId != null) {
            pendingBills = billService.getPendingBillsByPatient(patientId);
        } else {
            pendingBills = billService.getPendingBills();
        }
        return ResponseEntity.ok(pendingBills);
    }

    @GetMapping("/bills")
    public ResponseEntity<List<Bill>> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/summary")
    public ResponseEntity<BillingSummaryResponse> getBillingSummary() {
        List<Bill> bills = billService.getAllBills();
        BillingSummaryResponse summary = new BillingSummaryResponse();

        double totalRevenue = 0.0;
        double totalPaid = 0.0;

        for (Bill bill : bills) {
            if (bill.getTotalAmount() != null) totalRevenue += bill.getTotalAmount();
            if (bill.getPaidAmount() != null) totalPaid += bill.getPaidAmount();
        }

        summary.setTotalRevenue(totalRevenue);
        summary.setTotalPaid(totalPaid);
        summary.setTotalUnpaid(totalRevenue - totalPaid);
        summary.setBillCount(bills.size());

        return ResponseEntity.ok(summary);
    }
}