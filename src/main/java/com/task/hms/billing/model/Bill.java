package com.task.hms.billing.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long patientId;
    private String billType;
    private Double totalAmount;
    private Double paidAmount;
    private String status;
    private Long walkInPatientId;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BillItem> items;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Payment> payments;

    @OneToOne(mappedBy = "bill", cascade = CascadeType.ALL)
    @JsonManagedReference
    private InsuranceClaim insuranceClaim;

    @Transient
    private WalkInPatient walkInPatient;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getBillType() { return billType; }
    public void setBillType(String billType) { this.billType = billType; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Double getPaidAmount() { return paidAmount; }
    public void setPaidAmount(Double paidAmount) { this.paidAmount = paidAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getWalkInPatientId() { return walkInPatientId; }
    public void setWalkInPatientId(Long walkInPatientId) { this.walkInPatientId = walkInPatientId; }
    public List<BillItem> getItems() { return items; }
    public void setItems(List<BillItem> items) { this.items = items; }
    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }
    public InsuranceClaim getInsuranceClaim() { return insuranceClaim; }
    public void setInsuranceClaim(InsuranceClaim insuranceClaim) { this.insuranceClaim = insuranceClaim; }
    public WalkInPatient getWalkInPatient() { return walkInPatient; }
    public void setWalkInPatient(WalkInPatient walkInPatient) { this.walkInPatient = walkInPatient; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Bill)) return false;
        Bill other = (Bill) o;
        return id != null && id.equals(other.id);
    }
    @Override
    public int hashCode() { return 31; }
}
