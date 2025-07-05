package com.task.hms.billing.service.impl;

import com.task.hms.billing.model.InsuranceClaim;
import com.task.hms.billing.model.InsuranceClaimDocument;
import com.task.hms.billing.repository.InsuranceClaimRepository;
import com.task.hms.billing.repository.InsuranceClaimDocumentRepository;
import com.task.hms.billing.service.InsuranceClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InsuranceClaimServiceImpl implements InsuranceClaimService {
    @Autowired
    private InsuranceClaimRepository claimRepository;
    @Autowired
    private InsuranceClaimDocumentRepository documentRepository;

    private final String uploadDir = "uploads/insurance-claims";

    @Override
    public InsuranceClaim submitClaim(InsuranceClaim claim) {
        claim.setSubmittedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());
        claim.setStatus("SUBMITTED");
        return claimRepository.save(claim);
    }

    @Override
    public InsuranceClaim updateClaimStatus(Long claimId, String status, String remarks) {
        Optional<InsuranceClaim> opt = claimRepository.findById(claimId);
        if (opt.isEmpty()) return null;
        InsuranceClaim claim = opt.get();
        claim.setStatus(status);
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    @Override
    public InsuranceClaim getClaim(Long claimId) {
        return claimRepository.findById(claimId).orElse(null);
    }

    @Override
    public List<InsuranceClaim> getClaimsByPatient(Long patientId) {
        // Assuming Bill has patientId and InsuranceClaim has Bill
        return claimRepository.findAll().stream()
            .filter(c -> c.getBill() != null && c.getBill().getPatientId() == patientId)
            .toList();
    }

    @Override
    public InsuranceClaimDocument uploadDocument(Long claimId, MultipartFile file, String uploadedBy) {
        InsuranceClaim claim = claimRepository.findById(claimId).orElse(null);
        if (claim == null) return null;
        try {
            Files.createDirectories(Paths.get(uploadDir));
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, file.getBytes());
            InsuranceClaimDocument doc = new InsuranceClaimDocument();
            doc.setInsuranceClaim(claim);
            doc.setFileUrl("/" + uploadDir + "/" + filename);
            doc.setUploadedBy(uploadedBy);
            doc.setUploadedAt(LocalDateTime.now());
            return documentRepository.save(doc);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<InsuranceClaimDocument> getDocuments(Long claimId) {
        return documentRepository.findByInsuranceClaimId(claimId);
    }
}
