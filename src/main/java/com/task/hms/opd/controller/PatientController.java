package com.task.hms.opd.controller;

import com.task.hms.opd.dto.PatientRegistrationRequest;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opd/patients")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody PatientRegistrationRequest request) {
        Patient patient = patientService.registerPatient(request);
        return ResponseEntity.ok(Map.of("data", patient));
    }

    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(Map.of("data", patientService.getAllPatients()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
            .map(patient -> ResponseEntity.ok(Map.of("data", patient)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody PatientRegistrationRequest request) {
        return patientService.updatePatient(id, request)
            .map(patient -> ResponseEntity.ok(Map.of("data", patient)))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<?> getPatientsPaged(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String patientId) {
        Page<Patient> page = patientService.getPatientsPaged(pageable, name, patientId);
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
