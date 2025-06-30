package com.task.hms.ipd.dto;

import java.time.LocalDateTime;

public class IPDVitalsDTO {
    private Long id;
    private Long admissionId;
    private LocalDateTime timestamp;
    private String bp;
    private Integer pulse;
    private Double temperature;
    private Long nurseId;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAdmissionId() { return admissionId; }
    public void setAdmissionId(Long admissionId) { this.admissionId = admissionId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getBp() { return bp; }
    public void setBp(String bp) { this.bp = bp; }
    public Integer getPulse() { return pulse; }
    public void setPulse(Integer pulse) { this.pulse = pulse; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Long getNurseId() { return nurseId; }
    public void setNurseId(Long nurseId) { this.nurseId = nurseId; }
}
