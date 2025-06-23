package com.task.hms.opd.service.impl;

import com.task.hms.opd.dto.AppointmentRequest;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.repository.AppointmentRepository;
import com.task.hms.opd.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(request.getStatus() != null ? request.getStatus() : Appointment.Status.SCHEDULED);
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Appointment> updateAppointment(Long id, AppointmentRequest request) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setPatientId(request.getPatientId());
            appointment.setDoctorId(request.getDoctorId());
            appointment.setAppointmentDate(request.getAppointmentDate());
            appointment.setAppointmentTime(request.getAppointmentTime());
            appointment.setReason(request.getReason());
            appointment.setNotes(request.getNotes());
            appointment.setStatus(request.getStatus() != null ? request.getStatus() : appointment.getStatus());
            return appointmentRepository.save(appointment);
        });
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public Page<Appointment> getAppointmentsPaged(Pageable pageable, Long doctorId, Long patientId) {
        if (doctorId != null && patientId != null) {
            return appointmentRepository.findByDoctorIdAndPatientId(doctorId, patientId, pageable);
        } else if (doctorId != null) {
            return appointmentRepository.findByDoctorId(doctorId, pageable);
        } else if (patientId != null) {
            return appointmentRepository.findByPatientId(patientId, pageable);
        } else {
            return appointmentRepository.findAll(pageable);
        }
    }

    @Override
    public List<Appointment> getTodayAppointments() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDateTime start = today.atStartOfDay();
        java.time.LocalDateTime end = today.plusDays(1).atStartOfDay().minusNanos(1);
        return appointmentRepository.findByAppointmentTimeBetween(start, end);
    }
}
