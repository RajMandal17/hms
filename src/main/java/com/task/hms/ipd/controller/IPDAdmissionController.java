package com.task.hms.ipd.controller;

import com.task.hms.ipd.dto.*;
import com.task.hms.ipd.service.IPDAdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ipd/admissions")
public class IPDAdmissionController {
    @Autowired
    private IPDAdmissionService admissionService;

    @PostMapping
    public ResponseEntity<IPDAdmissionResponseDTO> admitPatient(@RequestBody IPDAdmissionRequestDTO request) {
        return ResponseEntity.ok(admissionService.admitPatient(request));
    }

    @GetMapping
    public ResponseEntity<List<IPDAdmissionResponseDTO>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IPDAdmissionResponseDTO> getAdmission(@PathVariable Long id) {
        IPDAdmissionResponseDTO dto = admissionService.getAdmission(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/discharge")
    public ResponseEntity<Void> dischargePatient(@PathVariable Long id) {
        admissionService.dischargePatient(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<IPDAdmissionResponseDTO> updateAdmission(@PathVariable Long id, @RequestBody IPDAdmissionUpdateRequestDTO request) {
        request.setId(id);
        IPDAdmissionResponseDTO updated = admissionService.updateAdmission(request);
        return ResponseEntity.ok(updated);
    }
}
