package com.task.hms.ipd.service.impl;

import com.task.hms.ipd.dto.IPDPrescriptionRequest;
import com.task.hms.ipd.model.IPDPrescription;
import com.task.hms.ipd.repository.IPDPrescriptionRepository;
import com.task.hms.ipd.service.IPDPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IPDPrescriptionServiceImpl implements IPDPrescriptionService {

    @Autowired
    private IPDPrescriptionRepository prescriptionRepository;

    @Override
    public IPDPrescription createPrescription(IPDPrescriptionRequest request) {
        IPDPrescription prescription = new IPDPrescription();
        prescription.setIpdAdmissionId(request.getIpdAdmissionId());
        prescription.setPatientId(request.getPatientId());
        prescription.setDoctorId(request.getDoctorId());
        prescription.setStatus("PENDING");
        prescription.setCreatedAt(LocalDateTime.now());
        prescription.setUpdatedAt(LocalDateTime.now());
        // Map medicines
        prescription.setMedicines(
            request.getMedicines().stream().map(m -> {
                IPDPrescription.PrescribedMedicine pm = new IPDPrescription.PrescribedMedicine();
                pm.setMedicineId(m.getMedicineId());
                pm.setMedicineName(m.getMedicineName());
                pm.setQuantity(m.getQuantity());
                pm.setDosage(m.getDosage());
                pm.setInstructions(m.getInstructions());
                return pm;
            }).toList()
        );
        return prescriptionRepository.save(prescription);
    }

    @Override
    public List<IPDPrescription> getPendingPrescriptions() {
        return prescriptionRepository.findByStatus("PENDING");
    }

    @Override
    public IPDPrescription fulfillPrescription(Long prescriptionId) {
        IPDPrescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow();
        prescription.setStatus("FULFILLED");
        prescription.setUpdatedAt(LocalDateTime.now());
        return prescriptionRepository.save(prescription);
    }

    @Override
    public List<IPDPrescription> getPrescriptionsByAdmission(Long ipdAdmissionId) {
        return prescriptionRepository.findByIpdAdmissionId(ipdAdmissionId);
    }
}
