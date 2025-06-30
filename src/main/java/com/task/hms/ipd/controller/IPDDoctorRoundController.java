package com.task.hms.ipd.controller;

import com.task.hms.ipd.dto.IPDDoctorRoundDTO;
import com.task.hms.ipd.service.IPDDoctorRoundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ipd/rounds")
public class IPDDoctorRoundController {
    @Autowired
    private IPDDoctorRoundService roundService;

    @PostMapping
    public ResponseEntity<IPDDoctorRoundDTO> addRound(@RequestBody IPDDoctorRoundDTO dto) {
        return ResponseEntity.ok(roundService.addDoctorRound(dto));
    }

    @GetMapping("/{admissionId}")
    public ResponseEntity<List<IPDDoctorRoundDTO>> getRounds(@PathVariable Long admissionId) {
        return ResponseEntity.ok(roundService.getRoundsByAdmission(admissionId));
    }
}
