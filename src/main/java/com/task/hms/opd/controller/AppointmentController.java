package com.task.hms.opd.controller;

import com.task.hms.opd.dto.AppointmentDTO;
import com.task.hms.opd.dto.AppointmentRequest;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.task.hms.opd.repository.PatientRepository;
import com.task.hms.user.repository.UserRepository;
import com.task.hms.opd.model.Patient;
import com.task.hms.user.model.User;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/opd/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.bookAppointment(request);
        return ResponseEntity.ok(Map.of("data", appointment));
    }

    @GetMapping
    public ResponseEntity<?> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        List<AppointmentDTO> dtos = appointments.stream().map(appointment -> {
            Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
            User doctor = userRepository.findById(appointment.getDoctorId()).orElse(null);
            return new AppointmentDTO(appointment, patient, doctor);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("data", dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
            .map(appointment -> ResponseEntity.ok(Map.of("data", appointment)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        return appointmentService.updateAppointment(id, request)
            .map(appointment -> ResponseEntity.ok(Map.of("data", appointment)))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<?> getAppointmentsPaged(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId) {
        Page<Appointment> page = appointmentService.getAppointmentsPaged(pageable, doctorId, patientId);
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

    @GetMapping("/today")
    public ResponseEntity<?> getTodayAppointments() {
        List<Appointment> todayAppointments = appointmentService.getTodayAppointments();
        return ResponseEntity.ok(Map.of("data", todayAppointments));
    }
}
