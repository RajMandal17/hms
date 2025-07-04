package com.task.hms.ipd.repository;

import com.task.hms.ipd.model.IPDPrescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPDPrescriptionRepository extends JpaRepository<IPDPrescription, Long> {
    List<IPDPrescription> findByStatus(String status);
    List<IPDPrescription> findByIpdAdmissionId(Long ipdAdmissionId);
}
