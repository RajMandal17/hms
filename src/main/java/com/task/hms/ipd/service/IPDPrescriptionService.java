package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.IPDPrescriptionRequest;
import com.task.hms.ipd.model.IPDPrescription;

import java.util.List;

public interface IPDPrescriptionService {
    IPDPrescription createPrescription(IPDPrescriptionRequest request);
    List<IPDPrescription> getPendingPrescriptions();
    IPDPrescription fulfillPrescription(Long prescriptionId);
    List<IPDPrescription> getPrescriptionsByAdmission(Long ipdAdmissionId);
}
