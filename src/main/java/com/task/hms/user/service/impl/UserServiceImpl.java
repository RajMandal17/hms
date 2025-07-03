package com.task.hms.user.service.impl;

import com.task.hms.user.dto.UserRegistrationRequest;
import com.task.hms.user.model.Role;
import com.task.hms.user.model.RoleType;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.RoleRepository;
import com.task.hms.user.repository.UserRepository;
import com.task.hms.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User registerUser(UserRegistrationRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Set<Role> roles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            RoleType roleType = RoleType.valueOf(roleName);
            roles.add(roleRepository.findByName(roleType).orElseThrow(() -> new RuntimeException("Role not found: " + roleName)));
        }
        user.setRoles(roles);
        // By default, mustChangePassword is false for normal users
        return userRepository.save(user);
    }

    // Example authentication method (pseudo, adapt to your actual logic)
    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        // Log a warning if default admin is used
        String defaultAdminUsername = System.getenv().getOrDefault("HMS_ADMIN_USERNAME", "admin");
        if (user.getUsername().equals(defaultAdminUsername)) {
            logger.warn("Default admin account is in use. Please change the password immediately.");
        }
        // If mustChangePassword is true, throw a special exception (to be handled by controller)
        if (user.isMustChangePassword()) {
            throw new RuntimeException("PASSWORD_CHANGE_REQUIRED");
        }
        return user;
    }
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }
}
