package com.task.hms.opd.controller;

import com.task.hms.opd.dto.ConsultationRequest;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opd/consultations")
public class ConsultationController {
    @Autowired
    private ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<?> createConsultation(@RequestBody ConsultationRequest request) {
        Consultation consultation = consultationService.addConsultation(request);
        return ResponseEntity.ok(Map.of("data", consultation));
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<Consultation>> getConsultationHistory(@PathVariable String patientId) {
        List<Consultation> history = consultationService.getConsultationsByPatientId(patientId);
        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<?> getAllConsultations() {
        return ResponseEntity.ok(Map.of("data", consultationService.getAllConsultations()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getConsultationById(@PathVariable Long id) {
        return consultationService.getConsultationById(id)
            .map(consultation -> ResponseEntity.ok(Map.of("data", consultation)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> updateConsultation(@PathVariable Long id, @RequestBody ConsultationRequest request) {
        return consultationService.updateConsultation(id, request)
            .map(consultation -> ResponseEntity.ok(Map.of("data", consultation)))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<?> getConsultationsPaged(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) Long appointmentId) {
        Page<Consultation> page = consultationService.getConsultationsPaged(pageable, doctorName, appointmentId);
        return ResponseEntity.ok(Map.of(
            "data", page.getContent(),
            "meta", Map.of(
                "page", page.getNumber(),
                "size", page.getSize(),
                "totalElements", page.getTotalElements(),
                "totalPages", page.getTotalPages()
            )
        ));
    }
}
