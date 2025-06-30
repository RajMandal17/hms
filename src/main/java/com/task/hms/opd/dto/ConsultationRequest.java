package com.task.hms.opd.dto;

import java.util.List;

public class ConsultationRequest {
    private Long appointmentId;
    private String doctorName;
    private String notes;
    private String diagnosis;
    private String prescription;
    private String symptoms;
    private String followUpDate;
    private List<MedicineDTO> medicines;

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
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
    public List<MedicineDTO> getMedicines() { return medicines; }
    public void setMedicines(List<MedicineDTO> medicines) { this.medicines = medicines; }

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
