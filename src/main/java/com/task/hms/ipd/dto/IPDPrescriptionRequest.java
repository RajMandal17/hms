package com.task.hms.ipd.dto;

import java.util.List;

public class IPDPrescriptionRequest {
    private Long ipdAdmissionId;
    private Long patientId;
    private Long doctorId;
    private List<MedicineItem> medicines;

    // Getters and setters
    public Long getIpdAdmissionId() { return ipdAdmissionId; }
    public void setIpdAdmissionId(Long ipdAdmissionId) { this.ipdAdmissionId = ipdAdmissionId; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public List<MedicineItem> getMedicines() { return medicines; }
    public void setMedicines(List<MedicineItem> medicines) { this.medicines = medicines; }

    public static class MedicineItem {
        private Long medicineId;
        private String medicineName;
        private Integer quantity;
        private String dosage;
        private String instructions;

        // Getters and setters
        public Long getMedicineId() { return medicineId; }
        public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
    }
}
