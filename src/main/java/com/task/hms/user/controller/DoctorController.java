package com.task.hms.user.controller;

import com.task.hms.user.model.RoleType;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/opd/doctors")
public class DoctorController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(RoleType.DOCTOR);
        // You can map to a DTO if you want to hide sensitive fields
        List<Map<String, Object>> doctorList = doctors.stream().map(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getUsername());
            map.put("email", user.getEmail());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("data", doctorList));
    }
}
