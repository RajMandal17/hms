package com.task.hms.ipd.repository;

import com.task.hms.ipd.model.IpdAdmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IpdAdmissionRepository extends JpaRepository<IpdAdmission, Long> {
    List<IpdAdmission> findByPatientId(Long patientId);
    List<IpdAdmission> findByBed_Id(Long bedId);
    List<IpdAdmission> findByDischargeTimeIsNull(); // currently admitted
}
