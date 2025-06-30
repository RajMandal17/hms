package com.task.hms.opd.controller;

import com.task.hms.opd.dto.ConsultationRequest;
import com.task.hms.opd.dto.ConsultationResponseDTO;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.service.ConsultationService;
import com.task.hms.opd.util.PdfReportUtil;
import com.task.hms.opd.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
        // Optionally, map Consultation to ConsultationDTO for frontend
        return ResponseEntity.ok(Map.of("data", consultation));
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<ConsultationResponseDTO>> getConsultationHistory(@PathVariable String patientId) {
        List<ConsultationResponseDTO> history = consultationService.getConsultationsByPatientId(patientId);
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
    public ResponseEntity<?> updateConsultation(@PathVariable Long id, @RequestBody ConsultationRequest request) {
        return consultationService.updateConsultation(id, request)
            .map(consultation -> ResponseEntity.ok(Map.of("data", consultation)))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
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
        // Map Consultation entities to ConsultationResponseDTOs
        List<ConsultationResponseDTO> dtos = page.getContent().stream()
            .map(consultationService::mapToResponseDTO)
            .toList();
        // Return paged response with DTOs
        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "content", dtos,
                "totalElements", page.getTotalElements(),
                "totalPages", page.getTotalPages(),
                "size", page.getSize(),
                "number", page.getNumber(),
                "first", page.isFirst(),
                "last", page.isLast()
            )
        ));
    }

    @GetMapping("/history/{patientId}/pdf")
    public ResponseEntity<byte[]> getConsultationHistoryPdf(@PathVariable String patientId) {
        List<ConsultationResponseDTO> history = consultationService.getConsultationsByPatientId(patientId);
        // Fetch patient and calculate bill (dummy value for now)
        Patient patient = consultationService.getPatientById(patientId);
        double billAmount = consultationService.calculateBillForPatient(patientId); // Implement as needed
        try {
            byte[] pdfBytes = PdfReportUtil.generatePatientHistoryPdf(patient, history, billAmount);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "patient_history_" + patientId + ".pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
