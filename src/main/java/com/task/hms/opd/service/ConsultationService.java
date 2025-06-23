package com.task.hms.opd.service;

import com.task.hms.opd.dto.ConsultationRequest;
import com.task.hms.opd.model.Consultation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConsultationService {
    Consultation addConsultation(ConsultationRequest request);
    List<Consultation> getConsultationsByPatientId(String patientId);
    List<Consultation> getAllConsultations();
    Optional<Consultation> getConsultationById(Long id);
    Optional<Consultation> updateConsultation(Long id, ConsultationRequest request);
    void deleteConsultation(Long id);
    Page<Consultation> getConsultationsPaged(Pageable pageable, String doctorName, Long appointmentId);
}
