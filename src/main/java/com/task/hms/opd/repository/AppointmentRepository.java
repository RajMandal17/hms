package com.task.hms.opd.repository;

import com.task.hms.opd.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorName(String doctorName);

    Page<Appointment> findByDoctorNameContainingIgnoreCaseAndPatientId(String doctorName, Long patientId,
            Pageable pageable);

    Page<Appointment> findByDoctorNameContainingIgnoreCase(String doctorName, Pageable pageable);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findByDoctorId(Long doctorId);

    Page<Appointment> findByDoctorIdAndPatientId(Long doctorId, Long patientId, Pageable pageable);

    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, java.time.LocalDate appointmentDate);

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(Long doctorId, java.time.LocalDate appointmentDate,
            java.time.LocalTime appointmentTime);
}
