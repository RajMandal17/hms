package com.task.hms.ipd.dto;

import java.time.LocalDateTime;

public class IPDAdmissionUpdateRequestDTO {
    private Long id;
    private LocalDateTime dischargeDate;
    private String dischargeSummary;
    private String dischargeTime; // Store as string (HH:mm) for simplicity
    private Double totalBill;
    private Long bedId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDischargeDate() { return dischargeDate; }
    public void setDischargeDate(LocalDateTime dischargeDate) { this.dischargeDate = dischargeDate; }
    public String getDischargeSummary() { return dischargeSummary; }
    public void setDischargeSummary(String dischargeSummary) { this.dischargeSummary = dischargeSummary; }
    public String getDischargeTime() { return dischargeTime; }
    public void setDischargeTime(String dischargeTime) { this.dischargeTime = dischargeTime; }
    public Double getTotalBill() { return totalBill; }
    public void setTotalBill(Double totalBill) { this.totalBill = totalBill; }
    public Long getBedId() { return bedId; }
    public void setBedId(Long bedId) { this.bedId = bedId; }
}
