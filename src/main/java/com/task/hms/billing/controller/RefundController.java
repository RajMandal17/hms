package com.task.hms.billing.controller;

import com.task.hms.billing.model.Refund;
import com.task.hms.billing.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing/refunds")
public class RefundController {
    @Autowired
    private RefundService refundService;

    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @PostMapping
    public ResponseEntity<Refund> processRefund(@RequestParam Long billId,
                                                @RequestParam Double amount,
                                                @RequestParam String reason,
                                                @RequestParam String processedBy) {
        try {
            Refund refund = refundService.processRefund(billId, amount, reason, processedBy);
            return ResponseEntity.ok(refund);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Refund>> getAllRefunds() {
        return ResponseEntity.ok(refundService.getAllRefunds());
    }

    @GetMapping("/by-bill/{billId}")
    public ResponseEntity<List<Refund>> getRefundsByBill(@PathVariable Long billId) {
        return ResponseEntity.ok(refundService.getRefundsByBill(billId));
    }
}
