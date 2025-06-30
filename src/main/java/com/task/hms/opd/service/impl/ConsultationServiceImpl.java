package com.task.hms.opd.service.impl;

import com.task.hms.opd.dto.ConsultationRequest;
import com.task.hms.opd.dto.ConsultationResponseDTO;
import com.task.hms.opd.dto.MedicineDTO;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.repository.ConsultationRepository;
import com.task.hms.opd.repository.AppointmentRepository;
import com.task.hms.opd.repository.PatientRepository;
import com.task.hms.opd.service.ConsultationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultationServiceImpl implements ConsultationService {
    @Autowired
    private ConsultationRepository consultationRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public Consultation addConsultation(ConsultationRequest request) {
        Consultation consultation = new Consultation();
        consultation.setAppointmentId(request.getAppointmentId());
        // Fetch the appointment and set doctorName from it
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        consultation.setDoctorName(appointment.getDoctorName());
        consultation.setConsultationTime(LocalDateTime.now());
        consultation.setNotes(request.getNotes());
        consultation.setDiagnosis(request.getDiagnosis());
        consultation.setPrescription(request.getPrescription());
        consultation.setSymptoms(request.getSymptoms());
        consultation.setFollowUpDate(request.getFollowUpDate());
        try {
            if (request.getMedicines() != null) {
                consultation.setMedicinesJson(objectMapper.writeValueAsString(request.getMedicines()));
            }
        } catch (Exception e) {
            consultation.setMedicinesJson(null);
        }
        return consultationRepository.save(consultation);
    }

    @Override
    public ConsultationResponseDTO mapToResponseDTO(Consultation consultation) {
        ConsultationResponseDTO dto = new ConsultationResponseDTO();
        dto.setId(consultation.getId());
        dto.setAppointmentId(consultation.getAppointmentId());
        dto.setDoctorName(consultation.getDoctorName());
        dto.setSymptoms(consultation.getSymptoms());
        dto.setDiagnosis(consultation.getDiagnosis());
        dto.setNotes(consultation.getNotes());
        dto.setPrescription(consultation.getPrescription());
        dto.setConsultationTime(consultation.getConsultationTime());
        // Convert followUpDate from String to LocalDate
        if (consultation.getFollowUpDate() != null && !consultation.getFollowUpDate().isEmpty()) {
            dto.setFollowUpDate(java.time.LocalDate.parse(consultation.getFollowUpDate()));
        } else {
            dto.setFollowUpDate(null);
        }
        // Fetch appointment and patient for names
        Appointment appointment = appointmentRepository.findById(consultation.getAppointmentId()).orElse(null);
        if (appointment != null) {
            dto.setPatientId(appointment.getPatientId());
            Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
            if (patient != null) dto.setPatientName(patient.getName());
        }
        // Deserialize medicines
        try {
            if (consultation.getMedicinesJson() != null) {
                List<MedicineDTO> medicines = objectMapper.readValue(
                    consultation.getMedicinesJson(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, MedicineDTO.class)
                );
                dto.setMedicines(medicines);
            }
        } catch (Exception e) {
            dto.setMedicines(null);
        }
        return dto;
    }

    @Override
    public List<ConsultationResponseDTO> getConsultationsByPatientId(String patientId) {
        Long patientIdLong = Long.valueOf(patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientIdLong);
        List<Long> appointmentIds = appointments.stream().map(Appointment::getId).collect(Collectors.toList());
        return consultationRepository.findAll().stream()
                .filter(c -> appointmentIds.contains(c.getAppointmentId()))
                .sorted((a, b) -> b.getConsultationTime().compareTo(a.getConsultationTime()))
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsultationResponseDTO> getAllConsultations() {
        return consultationRepository.findAll().stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Consultation> updateConsultation(Long id, ConsultationRequest request) {
        return consultationRepository.findById(id).map(consultation -> {
            consultation.setAppointmentId(request.getAppointmentId());
            // Set doctorName from appointment
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            consultation.setDoctorName(appointment.getDoctorName());
            consultation.setNotes(request.getNotes());
            consultation.setDiagnosis(request.getDiagnosis());
            consultation.setPrescription(request.getPrescription());
            consultation.setSymptoms(request.getSymptoms());
            consultation.setFollowUpDate(request.getFollowUpDate());
            try {
                if (request.getMedicines() != null) {
                    consultation.setMedicinesJson(objectMapper.writeValueAsString(request.getMedicines()));
                }
            } catch (Exception e) {
                consultation.setMedicinesJson(null);
            }
            return consultationRepository.save(consultation);
        });
    }

    @Override
    @Transactional
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

    @Override
    public Page<Consultation> getConsultationsPaged(Pageable pageable, String doctorName, Long appointmentId) {
        if (doctorName != null && appointmentId != null) {
            return consultationRepository.findByDoctorNameContainingIgnoreCaseAndAppointmentId(doctorName, appointmentId, pageable);
        } else if (doctorName != null) {
            return consultationRepository.findByDoctorNameContainingIgnoreCase(doctorName, pageable);
        } else if (appointmentId != null) {
            return consultationRepository.findByAppointmentId(appointmentId, pageable);
        } else {
            return consultationRepository.findAll(pageable);
        }
    }

    @Override
    public Patient getPatientById(String patientId) {
        return patientRepository.findById(Long.valueOf(patientId)).orElse(null);
    }

    @Override
    public double calculateBillForPatient(String patientId) {
        // Dummy implementation: sum up a fixed amount per consultation
        List<ConsultationResponseDTO> consultations = getConsultationsByPatientId(patientId);
        return consultations.size() * 500.0; // e.g., Rs. 500 per consultation
    }
}
