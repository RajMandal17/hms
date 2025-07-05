package com.task.hms.config;

import com.task.hms.user.model.Role;
import com.task.hms.user.model.RoleType;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.RoleRepository;
import com.task.hms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.EnumSet;

@Configuration
public class AdminUserInitializer {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdminUserAndRolesIfNotExists() {
        return args -> {
            // Ensure all roles from RoleType exist in DB
            for (RoleType roleType : EnumSet.allOf(RoleType.class)) {
                roleRepository.findByName(roleType).orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleType);
                    return roleRepository.save(role);
                });
            }

            // Ensure admin user exists
            if (!userRepository.existsByUsername("admin")) {
                Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                        .orElseThrow(() -> new RuntimeException("ADMIN role not found (should never happen)"));
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@hms.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRoles(Collections.singleton(adminRole));
                userRepository.save(admin);
                System.out.println("Default admin user created: admin / admin123");
            }
        };
    }
}
