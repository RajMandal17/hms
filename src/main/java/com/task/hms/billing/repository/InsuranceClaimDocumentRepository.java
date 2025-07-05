package com.task.hms.billing.repository;

import com.task.hms.billing.model.InsuranceClaimDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InsuranceClaimDocumentRepository extends JpaRepository<InsuranceClaimDocument, Long> {
    List<InsuranceClaimDocument> findByInsuranceClaimId(Long insuranceClaimId);
}
