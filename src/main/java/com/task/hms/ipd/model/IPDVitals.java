package com.task.hms.ipd.model;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class IPDVitals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id")
    private IPDAdmission admission;

    private LocalDateTime timestamp;
    private String bp;
    private Integer pulse;
    private Double temperature;
    private Long nurseId;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public IPDAdmission getAdmission() { return admission; }
    public void setAdmission(IPDAdmission admission) { this.admission = admission; }
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
