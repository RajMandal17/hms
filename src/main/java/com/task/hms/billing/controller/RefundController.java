package com.task.hms.billing.controller;

import com.task.hms.billing.model.Refund;
import com.task.hms.billing.repository.RefundRepository;
import com.task.hms.billing.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing/refunds")
public class RefundController {
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private BillService billService;

    @PostMapping("/process")
    public ResponseEntity<?> processRefund(@RequestParam Long billId, @RequestParam Double amount, @RequestParam String reason, @RequestParam String processedBy) {
        try {
            billService.refundBill(billId, amount, reason, processedBy);
            return ResponseEntity.ok("Refund processed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-bill/{billId}")
    public ResponseEntity<List<Refund>> getRefundsByBill(@PathVariable Long billId) {
        List<Refund> refunds = refundRepository.findByBillId(billId);
        return ResponseEntity.ok(refunds);
    }
}
