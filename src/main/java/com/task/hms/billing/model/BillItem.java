package com.task.hms.billing.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class BillItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    @JsonBackReference
    private Bill bill;

    private String description;
    private Double amount;
    private String sourceType;
    private Long sourceId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bill getBill() { return bill; }
    public void setBill(Bill bill) { this.bill = bill; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BillItem)) return false;
        BillItem other = (BillItem) o;
        return id != null && id.equals(other.id);
    }
    @Override
    public int hashCode() { return 31; }
}
