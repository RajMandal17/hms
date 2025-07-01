package com.task.hms.opd.service.impl;

import com.task.hms.opd.dto.PatientRegistrationRequest;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.repository.PatientRepository;
import com.task.hms.opd.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PatientServiceImpl implements PatientService {
    @Autowired
    private PatientRepository patientRepository;

    @Override
    @Transactional
    public Patient registerPatient(PatientRegistrationRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setContact(request.getContact());
        patient.setAddress(request.getAddress());
        patient.setPhotoUrl(request.getPhotoUrl());
        patient.setEmail(request.getEmail());
        patient.setPatientId("PAT-" + UUID.randomUUID().toString().substring(0, 8));
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Patient> updatePatient(Long id, PatientRegistrationRequest request) {
        return patientRepository.findById(id).map(patient -> {
            patient.setName(request.getName());
            patient.setAge(request.getAge());
            patient.setGender(request.getGender());
            patient.setContact(request.getContact());
            patient.setAddress(request.getAddress());
            patient.setPhotoUrl(request.getPhotoUrl());
            patient.setEmail(request.getEmail());
            return patientRepository.save(patient);
        });
    }

    @Override
    @Transactional
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    @Override
    public Page<Patient> getPatientsPaged(Pageable pageable, String name, String patientId) {
        if (name != null && patientId != null) {
            return patientRepository.findByNameContainingIgnoreCaseAndPatientId(name, patientId, pageable);
        } else if (name != null) {
            return patientRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (patientId != null) {
            return patientRepository.findByPatientId(patientId, pageable);
        } else {
            return patientRepository.findAll(pageable);
        }
    }
}
