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

    // Store medicines as JSON string for now (can be improved with @ElementCollection)
    @Lob
    private String medicinesJson;

    private String prescriptionStatus; // e.g., PENDING, FULFILLED

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
    public String getMedicinesJson() { return medicinesJson; }
    public void setMedicinesJson(String medicinesJson) { this.medicinesJson = medicinesJson; }
    public String getPrescriptionStatus() { return prescriptionStatus; }
    public void setPrescriptionStatus(String prescriptionStatus) { this.prescriptionStatus = prescriptionStatus; }
}
