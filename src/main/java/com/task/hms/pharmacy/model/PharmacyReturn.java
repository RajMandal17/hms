package com.task.hms.pharmacy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class PharmacyReturn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    private PharmacySale sale;

    private LocalDateTime date;
    private Double amountRefunded;
    private Long processedBy; // FK to User

    @OneToMany(mappedBy = "pharmacyReturn")
    private List<PharmacyReturnItem> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PharmacySale getSale() { return sale; }
    public void setSale(PharmacySale sale) { this.sale = sale; }
    public java.time.LocalDateTime getDate() { return date; }
    public void setDate(java.time.LocalDateTime date) { this.date = date; }
    public Double getAmountRefunded() { return amountRefunded; }
    public void setAmountRefunded(Double amountRefunded) { this.amountRefunded = amountRefunded; }
    public Long getProcessedBy() { return processedBy; }
    public void setProcessedBy(Long processedBy) { this.processedBy = processedBy; }
    public java.util.List<PharmacyReturnItem> getItems() { return items; }
    public void setItems(java.util.List<PharmacyReturnItem> items) { this.items = items; }
}
