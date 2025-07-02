package com.task.hms.ipd.repository;

import com.task.hms.ipd.model.IpdVitals;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IpdVitalsRepository extends JpaRepository<IpdVitals, Long> {
    List<IpdVitals> findByAdmissionId(Long admissionId);
}
