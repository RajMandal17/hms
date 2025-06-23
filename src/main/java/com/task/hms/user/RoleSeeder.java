package com.task.hms.user;

import com.task.hms.user.model.Role;
import com.task.hms.user.model.RoleType;
import com.task.hms.user.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (RoleType type : RoleType.values()) {
            roleRepository.findByName(type).orElseGet(() -> {
                Role role = new Role();
                role.setName(type);
                return roleRepository.save(role);
            });
        }
    }
}
