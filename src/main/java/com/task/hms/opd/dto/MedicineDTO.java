package com.task.hms.opd.dto;

public class MedicineDTO {
    private String name;
    private String dosage;
    private String frequency;
    private String duration;
    private Integer quantity;
    private Double total;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}
