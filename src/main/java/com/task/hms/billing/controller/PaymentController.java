package com.task.hms.billing.controller;

import com.task.hms.billing.model.Payment;
import com.task.hms.billing.repository.PaymentRepository;
import com.task.hms.billing.model.Bill;
import com.task.hms.billing.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {


    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;



    @PostMapping("/record")
    public ResponseEntity<Payment> recordPayment(@RequestBody Payment payment) {
        payment.setPaidAt(LocalDateTime.now());
        payment.setStatus("PAID");
        Payment saved = paymentRepository.save(payment);

        // If payment is linked to a bill, update bill's paidAmount and status
        if (payment.getBill() != null && payment.getBill().getId() != null) {
            Bill bill = billRepository.findById(payment.getBill().getId()).orElse(null);
            if (bill != null) {
                double totalPaid = bill.getPaidAmount() != null ? bill.getPaidAmount() : 0.0;
                totalPaid += payment.getAmount() != null ? payment.getAmount() : 0.0;
                bill.setPaidAmount(totalPaid);
                if (bill.getTotalAmount() != null && totalPaid >= bill.getTotalAmount()) {
                    bill.setStatus("PAID");
                } else {
                    bill.setStatus("PARTIAL");
                }
                billRepository.save(bill);
            }
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/by-patient/{patientId}")
    public ResponseEntity<List<Payment>> getPaymentsByPatient(@PathVariable Long patientId) {
        List<Payment> payments = paymentRepository.findByPatientId(patientId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<List<Payment>> getPaymentsByAppointment(@PathVariable Long appointmentId) {
        List<Payment> payments = paymentRepository.findByAppointmentId(appointmentId);
        return ResponseEntity.ok(payments);
    }
}
