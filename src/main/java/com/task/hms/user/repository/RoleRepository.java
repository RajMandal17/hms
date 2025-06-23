package com.task.hms.user.repository;

import com.task.hms.user.model.Role;
import com.task.hms.user.model.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}
