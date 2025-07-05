package com.task.hms.billing.controller;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.InsuranceClaim;
import com.task.hms.billing.model.BillingSummary;
import com.task.hms.billing.dto.BillDTO;
import com.task.hms.billing.service.BillService;
import com.task.hms.opd.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;


@RestController
@RequestMapping("/api/billing")
public class BillingController {
    @Autowired
    private BillService billService;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/summary")
    public ResponseEntity<BillingSummary> getBillingSummary() {
        return ResponseEntity.ok(billService.getBillingSummary());
    }

    @GetMapping("/bills/pending")
    public ResponseEntity<List<Bill>> getPendingBills() {
        return ResponseEntity.ok(billService.getPendingBills());
    }

    @PostMapping("/bills")
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        Bill created = billService.createBill(bill);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/bills/{id}")
    public ResponseEntity<Bill> getBill(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        return bill != null ? ResponseEntity.ok(bill) : ResponseEntity.notFound().build();
    }

    @PostMapping("/bills/{id}/payment")
    public ResponseEntity<Payment> makePayment(@PathVariable Long id, @RequestBody Payment payment) {
        Payment result = billService.makePayment(id, payment);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/bills/{id}/insurance-claim")
    public ResponseEntity<InsuranceClaim> claimInsurance(@PathVariable Long id, @RequestBody InsuranceClaim claim) {
        InsuranceClaim result = billService.claimInsurance(id, claim);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bills/{id}/insurance-claim")
    public ResponseEntity<InsuranceClaim> getInsuranceClaimForBill(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        if (bill == null || bill.getInsuranceClaim() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(bill.getInsuranceClaim());
    }

    @GetMapping("/bills")
    public ResponseEntity<List<BillDTO>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBillsAsDTO());
    }

    // Add BillItem to a Bill (for OPD/IPD/Pharmacy charges)
    @PostMapping("/bills/{id}/items")
    public ResponseEntity<Bill> addBillItem(@PathVariable Long id, @RequestBody com.task.hms.billing.model.BillItem item) {
        Bill updated = billService.addBillItem(id, item);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Update a BillItem (amount, description, etc.)
    @PutMapping("/bills/items/{itemId}")
    public ResponseEntity<Bill> updateBillItem(@PathVariable Long itemId, @RequestBody com.task.hms.billing.model.BillItem updatedItem) {
        Bill updated = billService.updateBillItem(itemId, updatedItem);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Delete a BillItem
    @DeleteMapping("/bills/items/{itemId}")
    public ResponseEntity<Bill> deleteBillItem(@PathVariable Long itemId) {
        Bill updated = billService.deleteBillItem(itemId);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Consolidated IPD Bill: Get all charges for an admission
    @GetMapping("/ipd/consolidated/{admissionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BILLING')")
    public ResponseEntity<Bill> getConsolidatedIPDBill(@PathVariable Long admissionId) {
        Bill bill = billService.getConsolidatedIPDBill(admissionId);
        return bill != null ? ResponseEntity.ok(bill) : ResponseEntity.notFound().build();
    }

    // Finalize and create consolidated bill on discharge
    @PostMapping("/ipd/consolidated/{admissionId}/finalize")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BILLING')")
    public ResponseEntity<Bill> finalizeConsolidatedIPDBill(@PathVariable Long admissionId) {
        Bill bill = billService.finalizeConsolidatedIPDBill(admissionId);
        return bill != null ? ResponseEntity.ok(bill) : ResponseEntity.notFound().build();
    }

  
    
}
