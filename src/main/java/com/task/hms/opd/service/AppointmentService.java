package com.task.hms.opd.service;

import com.task.hms.opd.dto.AppointmentRequest;
import com.task.hms.opd.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    Appointment bookAppointment(AppointmentRequest request);

    List<Appointment> getAllAppointments();

    Optional<Appointment> getAppointmentById(Long id);

    Optional<Appointment> updateAppointment(Long id, AppointmentRequest request);

    void deleteAppointment(Long id);

    Page<Appointment> getAppointmentsPaged(Pageable pageable, Long doctorId, Long patientId);

    List<Appointment> getTodayAppointments();

    Appointment bookPublicAppointment(com.task.hms.opd.dto.PublicAppointmentRequestDTO request);

    List<java.time.LocalTime> getAvailableSlots(Long doctorId, java.time.LocalDate date);
}
