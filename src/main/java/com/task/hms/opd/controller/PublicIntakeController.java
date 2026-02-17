package com.task.hms.opd.controller;

import com.task.hms.opd.model.IntakeForm;
import com.task.hms.opd.repository.IntakeFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/intake")
public class PublicIntakeController {

    @Autowired
    private IntakeFormRepository intakeFormRepository;

    @PostMapping
    public ResponseEntity<IntakeForm> submitIntakeForm(@RequestBody IntakeForm form) {
        return ResponseEntity.ok(intakeFormRepository.save(form));
    }
}
