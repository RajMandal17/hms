package com.task.hms.billing.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fee_and_charges")
public class FeeAndCharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g. ROOM, PRESCRIPTION, CONSULTATION, etc.
    private String description;
    private Double amount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
