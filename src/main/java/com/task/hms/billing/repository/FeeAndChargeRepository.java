package com.task.hms.billing.repository;

import com.task.hms.billing.model.FeeAndCharge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeeAndChargeRepository extends JpaRepository<FeeAndCharge, Long> {
    Optional<FeeAndCharge> findByType(String type);
}
