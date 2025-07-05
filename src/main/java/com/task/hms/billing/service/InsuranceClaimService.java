package com.task.hms.billing.service;

import com.task.hms.billing.model.InsuranceClaim;
import com.task.hms.billing.model.InsuranceClaimDocument;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface InsuranceClaimService {
    InsuranceClaim submitClaim(InsuranceClaim claim);
    InsuranceClaim updateClaimStatus(Long claimId, String status, String remarks);
    InsuranceClaim getClaim(Long claimId);
    List<InsuranceClaim> getClaimsByPatient(Long patientId);
    InsuranceClaimDocument uploadDocument(Long claimId, MultipartFile file, String uploadedBy);
    List<InsuranceClaimDocument> getDocuments(Long claimId);
}
