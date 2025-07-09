package com.task.hms.billing.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long patientId;
    private Long walkInPatientId;
    private String billType; // OPD, IPD, PHARMACY
    private Double totalAmount;
    private Double paidAmount;
    private String status; // DRAFT, FINALIZED, PAID

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<BillItem> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getWalkInPatientId() { return walkInPatientId; }
    public void setWalkInPatientId(Long walkInPatientId) { this.walkInPatientId = walkInPatientId; }
    public String getBillType() { return billType; }
    public void setBillType(String billType) { this.billType = billType; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Double getPaidAmount() { return paidAmount; }
    public void setPaidAmount(Double paidAmount) { this.paidAmount = paidAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<BillItem> getItems() { return items; }
    public void setItems(List<BillItem> items) { this.items = items; }
}
