package com.task.hms.opd.repository;

import com.task.hms.opd.model.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findByDoctorNameContainingIgnoreCaseAndAppointmentId(String doctorName, Long appointmentId, Pageable pageable);
    Page<Consultation> findByDoctorNameContainingIgnoreCase(String doctorName, Pageable pageable);
    Page<Consultation> findByAppointmentId(Long appointmentId, Pageable pageable);
}
