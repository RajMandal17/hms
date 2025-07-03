package com.task.hms.config;

import com.task.hms.user.model.Role;
import com.task.hms.user.model.RoleType;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.RoleRepository;
import com.task.hms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.annotation.PostConstruct;
import java.util.Collections;

@Configuration
public class DatabaseInitializer {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createAdminUserIfNotExists() {
        // Read from environment variables, fallback to defaults
        String adminUsername = System.getenv().getOrDefault("HMS_ADMIN_USERNAME", "admin");
        String adminEmail = System.getenv().getOrDefault("HMS_ADMIN_EMAIL", "admin@hms.com");
        String adminPassword = System.getenv().getOrDefault("HMS_ADMIN_PASSWORD", "admin123");
        if (!userRepository.existsByUsername(adminUsername)) {
            Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                .orElseGet(() -> roleRepository.save(new Role() {{ setName(RoleType.ADMIN); }}));
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRoles(Collections.singleton(adminRole));
            admin.setMustChangePassword(true); // Force password change on first login
            userRepository.save(admin);
            System.out.println("Default admin user created: username=" + adminUsername + ", password=" + adminPassword);
        }
    }
}
