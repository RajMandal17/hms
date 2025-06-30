package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.*;
import java.util.List;

public interface IPDAdmissionService {
    IPDAdmissionResponseDTO admitPatient(IPDAdmissionRequestDTO request);
    List<IPDAdmissionResponseDTO> getAllAdmissions();
    IPDAdmissionResponseDTO getAdmission(Long id);
    void dischargePatient(Long id);
    // Add more as needed
}
