package com.task.hms.billing.controller;

import com.task.hms.billing.model.Payment;
import com.task.hms.billing.model.Bill;
import com.task.hms.billing.repository.PaymentRepository;
import com.task.hms.billing.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BillRepository billRepository;

    @PostMapping("/record")
    public ResponseEntity<Payment> recordPayment(@RequestBody Payment payment) {
        if (payment.getBill() != null && payment.getBill().getId() != null) {
            Bill bill = billRepository.findById(payment.getBill().getId()).orElse(null);
            if (bill == null) return ResponseEntity.badRequest().build();
            payment.setBill(bill);
            // Update bill paidAmount and status
            double newPaidAmount = (bill.getPaidAmount() != null ? bill.getPaidAmount() : 0) + (payment.getAmount() != null ? payment.getAmount() : 0);
            bill.setPaidAmount(newPaidAmount);
            if (bill.getTotalAmount() != null && newPaidAmount >= bill.getTotalAmount()) {
                bill.setStatus("PAID");
            }
            billRepository.save(bill);
        }
        payment.setPaidAt(LocalDateTime.now());
        payment.setStatus("PAID");
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }
}
