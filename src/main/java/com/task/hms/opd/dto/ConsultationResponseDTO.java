package com.task.hms.opd.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ConsultationResponseDTO {
    private Long id;
    private Long appointmentId;
    private String patientName;
    private Long patientId;
    private String doctorName;
    private String symptoms;
    private String diagnosis;
    private String notes;
    private List<MedicineDTO> medicines;
    private String prescription;
    private LocalDateTime consultationTime;
    private LocalDate followUpDate;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<MedicineDTO> getMedicines() { return medicines; }
    public void setMedicines(List<MedicineDTO> medicines) { this.medicines = medicines; }
    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }
    public LocalDateTime getConsultationTime() { return consultationTime; }
    public void setConsultationTime(LocalDateTime consultationTime) { this.consultationTime = consultationTime; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
}
