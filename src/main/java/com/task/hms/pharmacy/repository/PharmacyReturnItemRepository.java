package com.task.hms.pharmacy.repository;

import com.task.hms.pharmacy.model.PharmacyReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PharmacyReturnItemRepository extends JpaRepository<PharmacyReturnItem, Long> {
    @Query("SELECT SUM(pri.quantity) FROM PharmacyReturnItem pri JOIN pri.pharmacyReturn pr WHERE pr.sale.id = :saleId AND pri.medicineBatch.id = :batchId")
    Integer sumReturnedQuantityBySaleIdAndBatchId(@Param("saleId") Long saleId, @Param("batchId") Long batchId);
}
