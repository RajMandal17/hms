package com.task.hms.user.controller;

import com.task.hms.user.dto.UserRegistrationRequest;
import com.task.hms.user.model.User;
import com.task.hms.user.service.UserService;
import com.task.hms.config.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest request) {
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
