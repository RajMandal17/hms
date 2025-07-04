package com.task.hms.ipd.controller;

import com.task.hms.ipd.dto.IPDPrescriptionRequest;
import com.task.hms.ipd.model.IPDPrescription;
import com.task.hms.ipd.service.IPDPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ipd/prescriptions")
public class IPDPrescriptionController {

    @Autowired
    private IPDPrescriptionService prescriptionService;

    @PostMapping
    public IPDPrescription createPrescription(@RequestBody IPDPrescriptionRequest request) {
        return prescriptionService.createPrescription(request);
    }

    @GetMapping("/pending")
    public List<IPDPrescription> getPendingPrescriptions() {
        return prescriptionService.getPendingPrescriptions();
    }

    @PostMapping("/fulfill/{id}")
    public IPDPrescription fulfillPrescription(@PathVariable Long id) {
        return prescriptionService.fulfillPrescription(id);
    }

    @GetMapping("/admission/{ipdAdmissionId}")
    public List<IPDPrescription> getPrescriptionsByAdmission(@PathVariable Long ipdAdmissionId) {
        return prescriptionService.getPrescriptionsByAdmission(ipdAdmissionId);
    }
}
