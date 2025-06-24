package com.task.hms.opd.service.impl;

import com.task.hms.opd.dto.ConsultationRequest;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.repository.ConsultationRepository;
import com.task.hms.opd.repository.AppointmentRepository;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Override
    @Transactional
    public Consultation addConsultation(ConsultationRequest request) {
        Consultation consultation = new Consultation();
        consultation.setAppointmentId(request.getAppointmentId());
        consultation.setDoctorName(request.getDoctorName());
        consultation.setConsultationTime(LocalDateTime.now());
        consultation.setNotes(request.getNotes());
        consultation.setDiagnosis(request.getDiagnosis());
        consultation.setPrescription(request.getPrescription());
        return consultationRepository.save(consultation);
    }

    @Override
    public List<Consultation> getConsultationsByPatientId(String patientId) {
        // Convert patientId to Long to match repository method
        Long patientIdLong = Long.valueOf(patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientIdLong);
        List<Long> appointmentIds = appointments.stream().map(Appointment::getId).collect(Collectors.toList());
        return consultationRepository.findAll().stream()
                .filter(c -> appointmentIds.contains(c.getAppointmentId()))
                .sorted((a, b) -> b.getConsultationTime().compareTo(a.getConsultationTime()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
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
            consultation.setDoctorName(request.getDoctorName());
            consultation.setNotes(request.getNotes());
            consultation.setDiagnosis(request.getDiagnosis());
            consultation.setPrescription(request.getPrescription());
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
}
