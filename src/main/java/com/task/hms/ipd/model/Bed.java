package com.task.hms.ipd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "beds")
public class Bed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String bedNumber;
    @Column(nullable = false)
    private String status; // VACANT, OCCUPIED, CLEANING

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Ward getWard() { return ward; }
    public void setWard(Ward ward) { this.ward = ward; }
}
