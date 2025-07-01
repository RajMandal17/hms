package com.task.hms.billing.controller;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.InsuranceClaim;
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

    @GetMapping("/bills")
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    // Add BillItem to a Bill (for OPD/IPD/Pharmacy charges)
    @PostMapping("/bills/{id}/items")
    public ResponseEntity<Bill> addBillItem(@PathVariable Long id, @RequestBody com.task.hms.billing.model.BillItem item) {
        Bill updated = billService.addBillItem(id, item);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
    // TODO: Add PDF export endpoint
}
