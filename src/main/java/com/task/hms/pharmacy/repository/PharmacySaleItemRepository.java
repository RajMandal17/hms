package com.task.hms.pharmacy.repository;

import com.task.hms.pharmacy.model.PharmacySaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PharmacySaleItemRepository extends JpaRepository<PharmacySaleItem, Long> {
    Optional<PharmacySaleItem> findBySaleIdAndMedicineBatchId(Long saleId, Long medicineBatchId);
}
