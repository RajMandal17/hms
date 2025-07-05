package com.task.hms.billing.dto;

import com.task.hms.billing.model.BillItem;
import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.InsuranceClaim;
import java.util.List;

public class BillDTO {
    private Long id;
    private String patientName;
    private String billType;
    private Double totalAmount;
    private Double paidAmount;
    private String status;
    private List<BillItem> items;
    private List<Payment> payments;
    private InsuranceClaim insuranceClaim;

    public BillDTO(Long id, String patientName, String billType, Double totalAmount, Double paidAmount, String status,
                   List<BillItem> items, List<Payment> payments, InsuranceClaim insuranceClaim) {
        this.id = id;
        this.patientName = patientName;
        this.billType = billType;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
        this.status = status;
        this.items = items;
        this.payments = payments;
        this.insuranceClaim = insuranceClaim;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getBillType() { return billType; }
    public void setBillType(String billType) { this.billType = billType; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Double getPaidAmount() { return paidAmount; }
    public void setPaidAmount(Double paidAmount) { this.paidAmount = paidAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<BillItem> getItems() { return items; }
    public void setItems(List<BillItem> items) { this.items = items; }
    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }
    public InsuranceClaim getInsuranceClaim() { return insuranceClaim; }
    public void setInsuranceClaim(InsuranceClaim insuranceClaim) { this.insuranceClaim = insuranceClaim; }
}
