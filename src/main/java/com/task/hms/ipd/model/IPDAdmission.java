package com.task.hms.ipd.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.task.hms.ipd.dto.AdmissionStatus;

@Entity
@Table(name = "ipd_admissions")
public class IPDAdmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private Long doctorId;
    private Long wardId;
    // private Long bedId; // Removed to avoid duplicate mapping with bed entity

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bed_id")
    private IPDBed bed;

    private String attendantName;
    private String attendantContact;
    private String admissionNotes;
    private String insuranceDetails;
    private Double initialDeposit;

    @Enumerated(EnumType.STRING)
    private AdmissionStatus status; // ADMITTED, DISCHARGED, TRANSFERRED, CANCELLED

    @Column(nullable = false)
    private LocalDateTime admissionTime;
    private LocalDateTime dischargeTime;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Long getWardId() { return wardId; }
    public void setWardId(Long wardId) { this.wardId = wardId; }
    // public Long getBedId() { return bedId; }
    // public void setBedId(Long bedId) { this.bedId = bedId; }
    public IPDBed getBed() { return bed; }
    public void setBed(IPDBed bed) { this.bed = bed; }
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
    public LocalDateTime getAdmissionTime() { return admissionTime; }
    public void setAdmissionTime(LocalDateTime admissionTime) { this.admissionTime = admissionTime; }
    public LocalDateTime getDischargeTime() { return dischargeTime; }
    public void setDischargeTime(LocalDateTime dischargeTime) { this.dischargeTime = dischargeTime; }
}
