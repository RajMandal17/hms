package com.task.hms.billing.repository;

import com.task.hms.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
