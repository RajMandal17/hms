package com.task.hms.pharmacy.service.impl;

import com.task.hms.pharmacy.dto.PrescriptionFulfillmentRequest;
import com.task.hms.pharmacy.model.MedicineBatch;
import com.task.hms.pharmacy.model.PharmacySale;
import com.task.hms.pharmacy.model.PharmacySaleItem;
import com.task.hms.pharmacy.repository.MedicineBatchRepository;
import com.task.hms.pharmacy.repository.PharmacySaleItemRepository;
import com.task.hms.pharmacy.repository.PharmacySaleRepository;
import com.task.hms.pharmacy.service.PharmacySaleService;
import com.task.hms.opd.repository.ConsultationRepository;
import com.task.hms.ipd.model.IPDPrescription;
import com.task.hms.ipd.repository.IPDPrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PharmacySaleServiceImpl implements PharmacySaleService {

    @Autowired
    private PharmacySaleRepository saleRepository;
    @Autowired
    private MedicineBatchRepository batchRepository;
    @Autowired
    private PharmacySaleItemRepository saleItemRepository;
    @Autowired
    private ConsultationRepository consultationRepository;
    @Autowired
    private IPDPrescriptionRepository ipdPrescriptionRepository;

    @Override
    public PharmacySale createSale(PharmacySale sale) {
        return saleRepository.save(sale);
    }

    @Override
    public PharmacySale getSaleById(Long id) {
        Optional<PharmacySale> sale = saleRepository.findById(id);
        return sale.orElse(null);
    }

    @Override
    public List<PharmacySale> getAllSales() {
        return saleRepository.findAll();
    }

    @Override
    public PharmacySale updateSale(Long id, PharmacySale sale) {
        if (!saleRepository.existsById(id)) {
            return null;
        }
        sale.setId(id);
        return saleRepository.save(sale);
    }

    @Override
    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }

    @Override
    public PharmacySale fulfillPrescription(PrescriptionFulfillmentRequest request) {
        // Validate prescriptionId and patientId
        if (request.getPrescriptionId() == null || request.getPatientId() == null) {
            throw new IllegalArgumentException("Prescription and patient required");
        }
        // Create sale
        PharmacySale sale = new PharmacySale();
        sale.setPrescriptionId(request.getPrescriptionId());
        sale.setPatientId(request.getPatientId());
        sale.setDate(LocalDateTime.now());
        sale.setPharmacistId(null); // Set from context if available
        sale.setPaymentMode(request.getPaymentMode() != null ? PharmacySale.PaymentMode.valueOf(request.getPaymentMode()) : PharmacySale.PaymentMode.CASH);
        // Payment status logic
        if ("OPD".equalsIgnoreCase(request.getSaleType())) {
            sale.setPaymentStatus(PharmacySale.PaymentStatus.PAID);
        } else if ("IPD".equalsIgnoreCase(request.getSaleType())) {
            sale.setPaymentStatus(PharmacySale.PaymentStatus.UNPAID);
        } else {
            sale.setPaymentStatus(PharmacySale.PaymentStatus.PAID);
        }
        // Process dispensed items
        double total = 0.0;
        ArrayList<PharmacySaleItem> saleItems = new ArrayList<>();
        for (PrescriptionFulfillmentRequest.DispensedItem item : request.getItems()) {
            MedicineBatch batch = batchRepository.findById(item.getBatchId())
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + item.getBatchId()));
            if (batch.getExpiryDate() != null && batch.getExpiryDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Batch expired: " + batch.getBatchNumber());
            }
            if (batch.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for batch: " + batch.getBatchNumber());
            }
            // Deduct stock
            batch.setQuantity(batch.getQuantity() - item.getQuantity());
            batchRepository.save(batch);
            // Create sale item
            PharmacySaleItem saleItem = new PharmacySaleItem();
            saleItem.setSale(sale);
            saleItem.setMedicineBatch(batch);
            saleItem.setQuantity(item.getQuantity());
            saleItem.setUnitPrice(batch.getSalePrice());
            saleItem.setTotalPrice(batch.getSalePrice() * item.getQuantity());
            total += saleItem.getTotalPrice();
            saleItems.add(saleItem);
        }
        sale.setTotalAmount(total);
        // Save sale and items
        sale = saleRepository.save(sale);
        for (PharmacySaleItem saleItem : saleItems) {
            saleItem.setSale(sale);
            saleItemRepository.save(saleItem);
        }
        sale.setItems(saleItems);
        // Update prescription status in OPD Consultation (if OPD)
        if ("OPD".equalsIgnoreCase(request.getSaleType()) && request.getPrescriptionId() != null) {
            consultationRepository.findById(request.getPrescriptionId()).ifPresent(consultation -> {
                consultation.setPrescriptionStatus("FULFILLED");
                consultationRepository.save(consultation);
            });
        }
        // For IPD, update IPDPrescription status if available
        if ("IPD".equalsIgnoreCase(request.getSaleType()) && request.getPrescriptionId() != null) {
            ipdPrescriptionRepository.findById(request.getPrescriptionId()).ifPresent(ipdPrescription -> {
                ipdPrescription.setStatus("FULFILLED");
                ipdPrescription.setUpdatedAt(java.time.LocalDateTime.now());
                ipdPrescriptionRepository.save(ipdPrescription);
            });
        }
        return sale;
    }

    @Override
    public PharmacySale processReturn(Long saleId, Long saleItemId, int quantity) {
        PharmacySale sale = saleRepository.findById(saleId)
            .orElseThrow(() -> new IllegalArgumentException("Sale not found: " + saleId));
        PharmacySaleItem saleItem = sale.getItems().stream()
            .filter(item -> item.getId().equals(saleItemId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Sale item not found: " + saleItemId));
        if (quantity <= 0 || quantity > saleItem.getQuantity()) {
            throw new IllegalArgumentException("Invalid return quantity");
        }
        // Update batch stock
        MedicineBatch batch = saleItem.getMedicineBatch();
        batch.setQuantity(batch.getQuantity() + quantity);
        batchRepository.save(batch);
        // Update sale item quantity and total price
        saleItem.setQuantity(saleItem.getQuantity() - quantity);
        saleItem.setTotalPrice(saleItem.getUnitPrice() * saleItem.getQuantity());
        saleItemRepository.save(saleItem);
        // Update sale total amount
        double newTotal = sale.getItems().stream().mapToDouble(PharmacySaleItem::getTotalPrice).sum();
        sale.setTotalAmount(newTotal);
        saleRepository.save(sale);
        // Optionally: handle refund logic, mark as returned if quantity is zero
        return sale;
    }
}
