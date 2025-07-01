package com.task.hms.pharmacy.model;

import jakarta.persistence.*;

@Entity
public class PharmacyReturnItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "return_id")
    private PharmacyReturn pharmacyReturn;

    @ManyToOne
    @JoinColumn(name = "medicine_batch_id")
    private MedicineBatch medicineBatch;

    private Integer quantity;
    private Double refundAmount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PharmacyReturn getPharmacyReturn() { return pharmacyReturn; }
    public void setPharmacyReturn(PharmacyReturn pharmacyReturn) { this.pharmacyReturn = pharmacyReturn; }
    public MedicineBatch getMedicineBatch() { return medicineBatch; }
    public void setMedicineBatch(MedicineBatch medicineBatch) { this.medicineBatch = medicineBatch; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }
}
