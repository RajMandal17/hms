package com.task.hms.opd.repository;

import com.task.hms.opd.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientId(String patientId);

    Page<Patient> findByNameContainingIgnoreCaseAndPatientId(String name, String patientId, Pageable pageable);

    Page<Patient> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Patient> findByPatientId(String patientId, Pageable pageable);
}
