package com.task.hms.billing.repository;

import com.task.hms.billing.model.RefundAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundAuditLogRepository extends JpaRepository<RefundAuditLog, Long> {
}
