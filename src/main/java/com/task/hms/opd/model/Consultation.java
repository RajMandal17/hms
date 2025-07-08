package com.task.hms.opd.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long appointmentId;

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private LocalDateTime consultationTime;

    private String notes;
    private String diagnosis;
    private String prescription;
    private String symptoms;
    private String followUpDate;


    // Store prescribed medicines as BillItem entities (linked to this consultation)
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "consultation_id")
    private java.util.List<com.task.hms.billing.model.BillItem> medicines;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bill_id")
    private com.task.hms.billing.model.Bill bill;

    private String prescriptionStatus; // e.g., PENDING, FULFILLED

    private Double fee;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public LocalDateTime getConsultationTime() { return consultationTime; }
    public void setConsultationTime(LocalDateTime consultationTime) { this.consultationTime = consultationTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }
    public java.util.List<com.task.hms.billing.model.BillItem> getMedicines() { return medicines; }
    public void setMedicines(java.util.List<com.task.hms.billing.model.BillItem> medicines) { this.medicines = medicines; }
    public com.task.hms.billing.model.Bill getBill() { return bill; }
    public void setBill(com.task.hms.billing.model.Bill bill) { this.bill = bill; }
    public String getPrescriptionStatus() { return prescriptionStatus; }
    public void setPrescriptionStatus(String prescriptionStatus) { this.prescriptionStatus = prescriptionStatus; }
    public Double getFee() { return fee; }
    public void setFee(Double fee) { this.fee = fee; }
}
