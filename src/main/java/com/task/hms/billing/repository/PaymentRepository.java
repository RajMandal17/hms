package com.task.hms.billing.repository;

import com.task.hms.billing.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBillId(Long billId);
    List<Payment> findByPatientId(Long patientId);
    List<Payment> findByAppointmentId(Long appointmentId);
}
