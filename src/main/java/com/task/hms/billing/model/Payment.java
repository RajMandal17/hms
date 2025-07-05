package com.task.hms.billing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    @JsonBackReference
    private Bill bill;

    private Long patientId;
    private Long appointmentId;
    private Double amount;
    private String mode;
    private LocalDateTime paidAt;
    private String reference;
    private String status; // PAID, PENDING

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bill getBill() { return bill; }
    public void setBill(Bill bill) { this.bill = bill; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public java.time.LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(java.time.LocalDateTime paidAt) { this.paidAt = paidAt; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Payment)) return false;
        Payment other = (Payment) o;
        return id != null && id.equals(other.id);
    }
    @Override
    public int hashCode() { return 31; }
}
