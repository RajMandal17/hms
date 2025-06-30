package com.task.hms.opd.dto;

import com.task.hms.opd.model.Patient;
import com.task.hms.user.model.User;
import com.task.hms.opd.model.Appointment;
import java.time.LocalDateTime;
import java.util.List;

public class ConsultationDTO {
    private Long id;
    private Patient patient;
    private User doctor;
    private Appointment appointment;
    private String symptoms;
    private String diagnosis;
    private String notes;
    private List<MedicineDTO> medicines;
    private LocalDateTime createdAt;
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public java.util.List<MedicineDTO> getMedicines() { return medicines; }
    public void setMedicines(java.util.List<MedicineDTO> medicines) { this.medicines = medicines; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class MedicineDTO {
        private String name;
        private String dose;
        private String frequency;
        private String duration;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDose() { return dose; }
        public void setDose(String dose) { this.dose = dose; }
        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
    }
}
