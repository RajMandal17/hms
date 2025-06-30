package com.task.hms.ipd.dto;

import java.time.LocalDateTime;

public class IPDDoctorRoundDTO {
    private Long id;
    private Long admissionId;
    private LocalDateTime timestamp;
    private Long doctorId;
    private String notes;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAdmissionId() { return admissionId; }
    public void setAdmissionId(Long admissionId) { this.admissionId = admissionId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
