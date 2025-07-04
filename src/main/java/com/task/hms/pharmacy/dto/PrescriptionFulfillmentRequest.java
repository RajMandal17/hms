package com.task.hms.pharmacy.dto;

import java.util.List;

public class PrescriptionFulfillmentRequest {
    private Long prescriptionId;
    private Long patientId;
    private List<DispensedItem> items;
    private String saleType; // OPD, IPD
    private String paymentMode; // CASH, CARD, UPI, etc.

    public static class DispensedItem {
        private Long medicineId;
        private Long batchId;
        private int quantity;
        // getters and setters
        public Long getMedicineId() { return medicineId; }
        public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
        public Long getBatchId() { return batchId; }
        public void setBatchId(Long batchId) { this.batchId = batchId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // getters and setters
    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public List<DispensedItem> getItems() { return items; }
    public void setItems(List<DispensedItem> items) { this.items = items; }
    public String getSaleType() { return saleType; }
    public void setSaleType(String saleType) { this.saleType = saleType; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
}
