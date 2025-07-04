package com.task.hms.pharmacy.service;

import com.task.hms.pharmacy.dto.PrescriptionFulfillmentRequest;
import com.task.hms.pharmacy.model.PharmacySale;
import java.util.List;

public interface PharmacySaleService {
    PharmacySale createSale(PharmacySale sale);
    PharmacySale getSaleById(Long id);
    List<PharmacySale> getAllSales();
    PharmacySale updateSale(Long id, PharmacySale sale);
    void deleteSale(Long id);
    PharmacySale fulfillPrescription(PrescriptionFulfillmentRequest request);
    PharmacySale processReturn(Long saleId, Long saleItemId, int quantity);
}
