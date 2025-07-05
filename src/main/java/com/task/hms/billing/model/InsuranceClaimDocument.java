package com.task.hms.billing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class InsuranceClaimDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "insurance_claim_id")
    @JsonBackReference
    private InsuranceClaim insuranceClaim;

    private String fileUrl;
    private String uploadedBy;
    private LocalDateTime uploadedAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InsuranceClaim getInsuranceClaim() { return insuranceClaim; }
    public void setInsuranceClaim(InsuranceClaim insuranceClaim) { this.insuranceClaim = insuranceClaim; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InsuranceClaimDocument)) return false;
        InsuranceClaimDocument other = (InsuranceClaimDocument) o;
        return id != null && id.equals(other.id);
    }
    @Override
    public int hashCode() { return 31; }
}
