package com.task.hms.user.controller;

import com.task.hms.user.dto.UserRegistrationRequest;
import com.task.hms.user.dto.LoginRequest;
import com.task.hms.user.dto.UserPasswordChangeRequest;
import com.task.hms.user.model.User;
import com.task.hms.user.service.UserService;
import com.task.hms.config.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.authenticate(request.getUsername(), request.getPassword());
            String token = jwtUtil.generateToken(user.getUsername());
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("roles", user.getRoles().stream().map(r -> r.getName().name()).toArray());
            userMap.put("mustChangePassword", user.isMustChangePassword());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userMap);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            if ("PASSWORD_CHANGE_REQUIRED".equals(ex.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "PASSWORD_CHANGE_REQUIRED"));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", ex.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody UserPasswordChangeRequest request) {
        try {
            userService.changePassword(request.getUsername(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok(Collections.singletonMap("message", "Password changed successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", ex.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.registerUser(request);
            // Generate JWT token for the new user
            String token = jwtUtil.generateToken(user.getUsername());
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("roles", user.getRoles().stream().map(r -> r.getName().name()).toArray());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userMap);
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException ex) {
            // Duplicate email or username
            String message = "Email or username already exists";
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Collections.singletonMap("message", message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "Registration failed"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("username", username);
            put("roles", roles);
        }});
    }
}
