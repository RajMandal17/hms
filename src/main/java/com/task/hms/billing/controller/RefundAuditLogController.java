package com.task.hms.billing.controller;

import com.task.hms.billing.model.RefundAuditLog;
import com.task.hms.billing.repository.RefundAuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing/refund-audit")
public class RefundAuditLogController {
    @Autowired
    private RefundAuditLogRepository refundAuditLogRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<RefundAuditLog>> getAllRefundAuditLogs() {
        return ResponseEntity.ok(refundAuditLogRepository.findAll());
    }
}
