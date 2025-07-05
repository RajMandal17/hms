package com.task.hms.billing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class InsuranceClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "bill_id")
    @JsonBackReference
    private Bill bill;

    private String tpaName;
    private String claimNumber;
    private Double claimedAmount;
    private Double approvedAmount;
    private String status;
    private String remarks;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "insuranceClaim", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<InsuranceClaimDocument> documents;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bill getBill() { return bill; }
    public void setBill(Bill bill) { this.bill = bill; }
    public String getTpaName() { return tpaName; }
    public void setTpaName(String tpaName) { this.tpaName = tpaName; }
    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
    public Double getClaimedAmount() { return claimedAmount; }
    public void setClaimedAmount(Double claimedAmount) { this.claimedAmount = claimedAmount; }
    public Double getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(Double approvedAmount) { this.approvedAmount = approvedAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<InsuranceClaimDocument> getDocuments() { return documents; }
    public void setDocuments(List<InsuranceClaimDocument> documents) { this.documents = documents; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InsuranceClaim)) return false;
        InsuranceClaim other = (InsuranceClaim) o;
        return id != null && id.equals(other.id);
    }
    @Override
    public int hashCode() { return 31; }
}
