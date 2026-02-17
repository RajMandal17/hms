package com.task.hms.opd.repository;

import com.task.hms.opd.model.IntakeForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntakeFormRepository extends JpaRepository<IntakeForm, Long> {
}
