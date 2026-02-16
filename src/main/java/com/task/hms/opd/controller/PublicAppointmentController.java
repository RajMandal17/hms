package com.task.hms.opd.controller;

import com.task.hms.opd.dto.PublicAppointmentRequestDTO;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.service.AppointmentService;
import com.task.hms.user.model.RoleType;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicAppointmentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/doctors")
    public ResponseEntity<List<Map<String, Object>>> getDoctors() {
        List<User> doctors = userRepository.findByRole(RoleType.DOCTOR);
        List<Map<String, Object>> response = doctors.stream().map(doctor -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", doctor.getId());
            map.put("name", doctor.getUsername());
            map.put("specialization", "General Physician");
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/slots")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(@RequestParam Long doctorId, @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        return ResponseEntity.ok(appointmentService.getAvailableSlots(doctorId, appointmentDate));
    }

    @PostMapping("/appointments/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody PublicAppointmentRequestDTO request) {
        return ResponseEntity.ok(appointmentService.bookPublicAppointment(request));
    }
}
