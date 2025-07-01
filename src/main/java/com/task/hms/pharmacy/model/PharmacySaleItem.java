package com.task.hms.pharmacy.model;

import jakarta.persistence.*;

@Entity
public class PharmacySaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    private PharmacySale sale;

    @ManyToOne
    @JoinColumn(name = "medicine_batch_id")
    private MedicineBatch medicineBatch;

    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PharmacySale getSale() { return sale; }
    public void setSale(PharmacySale sale) { this.sale = sale; }
    public MedicineBatch getMedicineBatch() { return medicineBatch; }
    public void setMedicineBatch(MedicineBatch medicineBatch) { this.medicineBatch = medicineBatch; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
}
