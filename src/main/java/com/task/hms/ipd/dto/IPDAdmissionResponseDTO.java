package com.task.hms.ipd.dto;

import java.time.LocalDateTime;

public class IPDAdmissionResponseDTO {
    private Long id;
    private Long patientId;
    private String patientName; // Added for frontend display
    private Long doctorId;
    private Long wardId;
    private Long bedId;
    private String attendantName;
    private String attendantContact;
    private String admissionNotes;
    private String insuranceDetails;
    private Double initialDeposit;
    private AdmissionStatus status;
    private LocalDateTime admissionDate;
    private LocalDateTime dischargeDate;
    private String dischargeSummary;
    private String dischargeTime;
    private Double totalBill;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Long getWardId() { return wardId; }
    public void setWardId(Long wardId) { this.wardId = wardId; }
    public Long getBedId() { return bedId; }
    public void setBedId(Long bedId) { this.bedId = bedId; }
    public String getAttendantName() { return attendantName; }
    public void setAttendantName(String attendantName) { this.attendantName = attendantName; }
    public String getAttendantContact() { return attendantContact; }
    public void setAttendantContact(String attendantContact) { this.attendantContact = attendantContact; }
    public String getAdmissionNotes() { return admissionNotes; }
    public void setAdmissionNotes(String admissionNotes) { this.admissionNotes = admissionNotes; }
    public String getInsuranceDetails() { return insuranceDetails; }
    public void setInsuranceDetails(String insuranceDetails) { this.insuranceDetails = insuranceDetails; }
    public Double getInitialDeposit() { return initialDeposit; }
    public void setInitialDeposit(Double initialDeposit) { this.initialDeposit = initialDeposit; }
    public AdmissionStatus getStatus() { return status; }
    public void setStatus(AdmissionStatus status) { this.status = status; }
    public LocalDateTime getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDateTime admissionDate) { this.admissionDate = admissionDate; }
    public LocalDateTime getDischargeDate() { return dischargeDate; }
    public void setDischargeDate(LocalDateTime dischargeDate) { this.dischargeDate = dischargeDate; }
    public String getDischargeSummary() { return dischargeSummary; }
    public void setDischargeSummary(String dischargeSummary) { this.dischargeSummary = dischargeSummary; }
    public String getDischargeTime() { return dischargeTime; }
    public void setDischargeTime(String dischargeTime) { this.dischargeTime = dischargeTime; }
    public Double getTotalBill() { return totalBill; }
    public void setTotalBill(Double totalBill) { this.totalBill = totalBill; }
}
