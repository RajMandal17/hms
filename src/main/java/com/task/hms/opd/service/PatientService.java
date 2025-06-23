package com.task.hms.opd.service;

import com.task.hms.opd.dto.PatientRegistrationRequest;
import com.task.hms.opd.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    Patient registerPatient(PatientRegistrationRequest request);

    List<Patient> getAllPatients();
    Optional<Patient> getPatientById(Long id);
    Optional<Patient> updatePatient(Long id, PatientRegistrationRequest request);
    void deletePatient(Long id);

    Page<Patient> getPatientsPaged(Pageable pageable, String name, String patientId);
}
