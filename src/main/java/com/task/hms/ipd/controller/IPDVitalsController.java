package com.task.hms.ipd.controller;

import com.task.hms.ipd.dto.IPDVitalsDTO;
import com.task.hms.ipd.service.IPDVitalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ipd/vitals")
public class IPDVitalsController {
    @Autowired
    private IPDVitalsService vitalsService;

    @PostMapping
    public ResponseEntity<IPDVitalsDTO> addVitals(@RequestBody IPDVitalsDTO dto) {
        return ResponseEntity.ok(vitalsService.addVitals(dto));
    }

    @GetMapping("/{admissionId}")
    public ResponseEntity<List<IPDVitalsDTO>> getVitals(@PathVariable Long admissionId) {
        return ResponseEntity.ok(vitalsService.getVitalsByAdmission(admissionId));
    }
}
