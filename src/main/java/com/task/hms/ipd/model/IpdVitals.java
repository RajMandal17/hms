package com.task.hms.ipd.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.task.hms.ipd.model.IPDAdmission;

@Entity
@Table(name = "ipd_vitals")
public class IpdVitals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admission_id")
    private IPDAdmission admission;

    @Column(nullable = false)
    private LocalDateTime recordedAt;
    private String recordedBy; // nurse/doctor name or ID
    private String notes;

    private Double temperature;
    private Integer pulse;
    private Integer systolicBP;
    private Integer diastolicBP;
    private Integer respirationRate;
    private Integer spo2;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public IPDAdmission getAdmission() { return admission; }
    public void setAdmission(IPDAdmission admission) { this.admission = admission; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Integer getPulse() { return pulse; }
    public void setPulse(Integer pulse) { this.pulse = pulse; }
    public Integer getSystolicBP() { return systolicBP; }
    public void setSystolicBP(Integer systolicBP) { this.systolicBP = systolicBP; }
    public Integer getDiastolicBP() { return diastolicBP; }
    public void setDiastolicBP(Integer diastolicBP) { this.diastolicBP = diastolicBP; }
    public Integer getRespirationRate() { return respirationRate; }
    public void setRespirationRate(Integer respirationRate) { this.respirationRate = respirationRate; }
    public Integer getSpo2() { return spo2; }
    public void setSpo2(Integer spo2) { this.spo2 = spo2; }
}
