package com.task.hms.ipd.repository;

import com.task.hms.ipd.model.IPDAdmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPDAdmissionRepository extends JpaRepository<IPDAdmission, Long> {
    List<IPDAdmission> findByPatientId(Long patientId);

    List<IPDAdmission> findByBedId(Long bedId);
}
