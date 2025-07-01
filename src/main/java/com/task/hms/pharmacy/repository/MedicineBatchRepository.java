package com.task.hms.pharmacy.repository;

import com.task.hms.pharmacy.model.MedicineBatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MedicineBatchRepository extends JpaRepository<MedicineBatch, Long> {
    List<MedicineBatch> findByQuantityLessThan(Integer threshold);
    List<MedicineBatch> findByExpiryDateBefore(LocalDate date);
}
