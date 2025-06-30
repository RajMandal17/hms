package com.task.hms.ipd.model;

import jakarta.persistence.*;
import com.task.hms.ipd.dto.BedStatus;

@Entity
@Table(name = "ipd_beds")
public class IPDBed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long wardId;
    private String bedNumber;

    @Enumerated(EnumType.STRING)
    private BedStatus status; // VACANT, OCCUPIED, CLEANING, MAINTENANCE

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getWardId() { return wardId; }
    public void setWardId(Long wardId) { this.wardId = wardId; }
    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }
    public BedStatus getStatus() { return status; }
    public void setStatus(BedStatus status) { this.status = status; }
}
