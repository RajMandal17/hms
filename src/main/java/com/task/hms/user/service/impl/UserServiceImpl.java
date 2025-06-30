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

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
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
        return userRepository.save(user);
    }
}
