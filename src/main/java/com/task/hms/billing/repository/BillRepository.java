package com.task.hms.billing.repository;

import com.task.hms.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByStatus(String status);
}
