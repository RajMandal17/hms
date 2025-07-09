package com.task.hms.billing.repository;

import com.task.hms.billing.model.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByBillId(Long billId);
}
