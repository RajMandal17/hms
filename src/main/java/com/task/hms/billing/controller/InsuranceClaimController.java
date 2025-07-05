package com.task.hms.billing.controller;

import com.task.hms.billing.model.InsuranceClaim;
import com.task.hms.billing.model.InsuranceClaimDocument;
import com.task.hms.billing.service.InsuranceClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/insurance/claims")
public class InsuranceClaimController {
    @Autowired
    private InsuranceClaimService claimService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','BILLING')")
    public ResponseEntity<InsuranceClaim> submitClaim(@RequestBody InsuranceClaim claim) {
        return ResponseEntity.ok(claimService.submitClaim(claim));
    }

    @PatchMapping("/{claimId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','BILLING')")
    public ResponseEntity<InsuranceClaim> updateStatus(@PathVariable Long claimId, @RequestParam String status, @RequestParam String remarks) {
        return ResponseEntity.ok(claimService.updateClaimStatus(claimId, status, remarks));
    }

    @GetMapping("/{claimId}")
    @PreAuthorize("hasAnyRole('ADMIN','BILLING','PATIENT')")
    public ResponseEntity<InsuranceClaim> getClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(claimService.getClaim(claimId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','BILLING','PATIENT')")
    public ResponseEntity<List<InsuranceClaim>> getClaimsByPatient(@RequestParam Long patientId) {
        return ResponseEntity.ok(claimService.getClaimsByPatient(patientId));
    }

    @PostMapping("/{claimId}/documents")
    @PreAuthorize("hasAnyRole('ADMIN','BILLING')")
    public ResponseEntity<InsuranceClaimDocument> uploadDocument(@PathVariable Long claimId, @RequestParam("file") MultipartFile file, Principal principal) {
        String uploadedBy = principal != null ? principal.getName() : "system";
        return ResponseEntity.ok(claimService.uploadDocument(claimId, file, uploadedBy));
    }

    @GetMapping("/{claimId}/documents")
    @PreAuthorize("hasAnyRole('ADMIN','BILLING','PATIENT')")
    public ResponseEntity<List<InsuranceClaimDocument>> getDocuments(@PathVariable Long claimId) {
        return ResponseEntity.ok(claimService.getDocuments(claimId));
    }
}
