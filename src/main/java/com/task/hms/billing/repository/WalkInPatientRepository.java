package com.task.hms.billing.repository;

import com.task.hms.billing.model.WalkInPatient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkInPatientRepository extends JpaRepository<WalkInPatient, Long> {
}
