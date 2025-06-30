package com.task.hms.ipd.dto;

import java.time.LocalDateTime;

public class IPDAdmissionRequestDTO {
    private Long patientId;
    private Long doctorId;
    private Long wardId;
    private Long bedId;
    private String attendantName;
    private String attendantContact;
    private String admissionNotes;
    private String insuranceDetails;
    private Double initialDeposit;
    private LocalDateTime admissionDate;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
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
    public LocalDateTime getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDateTime admissionDate) { this.admissionDate = admissionDate; }
}
