package com.task.hms.ipd.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class IPDDoctorRound {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id")
    private IPDAdmission admission;

    private LocalDateTime timestamp;
    private Long doctorId;
    private String notes;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public IPDAdmission getAdmission() { return admission; }
    public void setAdmission(IPDAdmission admission) { this.admission = admission; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
