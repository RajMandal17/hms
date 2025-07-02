package com.task.hms.ipd.repository;

import com.task.hms.ipd.model.Bed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByWardId(Long wardId);
    List<Bed> findByStatus(String status);
}
