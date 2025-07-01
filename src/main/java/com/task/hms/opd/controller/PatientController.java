package com.task.hms.opd.controller;

import com.task.hms.opd.dto.PatientRegistrationRequest;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.service.PatientService;
import com.task.hms.opd.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opd/patients")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createPatient(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("age") Integer age,
            @RequestParam("gender") String gender,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam("email") String email,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) throws Exception {
        System.out.println("firstName=" + firstName);
        System.out.println("lastName=" + lastName);
        System.out.println("age=" + age);
        System.out.println("gender=" + gender);
        System.out.println("phone=" + phone);
        System.out.println("address=" + address);
        System.out.println("photo=" + (photo != null ? photo.getOriginalFilename() : "null"));
        String name = (firstName + " " + lastName).trim();
        String photoUrl = fileUploadUtil.saveFile(photo);
        PatientRegistrationRequest request = new PatientRegistrationRequest();
        request.setName(name);
        request.setAge(age);
        request.setGender(gender);
        request.setContact(phone);
        request.setAddress(address);
        request.setPhotoUrl(photoUrl);
        request.setEmail(email);
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
