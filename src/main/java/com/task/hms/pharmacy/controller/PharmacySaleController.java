package com.task.hms.pharmacy.controller;

import com.task.hms.pharmacy.dto.PrescriptionFulfillmentRequest;
import com.task.hms.pharmacy.model.PharmacySale;
import com.task.hms.pharmacy.service.PharmacySaleService;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.repository.ConsultationRepository;
import com.task.hms.ipd.model.IPDPrescription;
import com.task.hms.ipd.repository.IPDPrescriptionRepository;
import com.task.hms.pharmacy.dto.PendingPrescriptionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/sales")
public class PharmacySaleController {

    @Autowired
    private PharmacySaleService saleService;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private IPDPrescriptionRepository ipdPrescriptionRepository;

    @PostMapping
    public PharmacySale createSale(@RequestBody PharmacySale sale) {
        return saleService.createSale(sale);
    }

    @GetMapping("/{id}")
    public PharmacySale getSaleById(@PathVariable Long id) {
        return saleService.getSaleById(id);
    }

    @GetMapping
    public List<PharmacySale> getAllSales() {
        return saleService.getAllSales();
    }

    @PutMapping("/{id}")
    public PharmacySale updateSale(@PathVariable Long id, @RequestBody PharmacySale sale) {
        return saleService.updateSale(id, sale);
    }

    @DeleteMapping("/{id}")
    public void deleteSale(@PathVariable Long id) {
        saleService.deleteSale(id);
    }

    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    @PostMapping("/fulfill")
    public PharmacySale fulfillPrescription(@RequestBody PrescriptionFulfillmentRequest request) {
        return saleService.fulfillPrescription(request);
    }

    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    @GetMapping("/pending-prescriptions")
    public List<PendingPrescriptionDTO> getAllPendingPrescriptions() {
        List<PendingPrescriptionDTO> result = new java.util.ArrayList<>();
        // OPD
        consultationRepository.findAll().stream()
            .filter(c -> c.getPrescriptionStatus() == null || "PENDING".equalsIgnoreCase(c.getPrescriptionStatus()))
            .forEach(c -> {
                PendingPrescriptionDTO dto = new PendingPrescriptionDTO();
                dto.setId(c.getId());
                dto.setType("OPD");
                dto.setPatientId(null); // Not available in Consultation
                dto.setDoctorId(null); // Not available in Consultation
                dto.setDoctorName(c.getDoctorName());
                dto.setStatus(c.getPrescriptionStatus() == null ? "PENDING" : c.getPrescriptionStatus());
                dto.setCreatedAt(c.getConsultationTime() != null ? c.getConsultationTime().toString() : null);
                result.add(dto);
            });
        // IPD
        ipdPrescriptionRepository.findByStatus("PENDING").forEach(ipd -> {
            PendingPrescriptionDTO dto = new PendingPrescriptionDTO();
            dto.setId(ipd.getId());
            dto.setType("IPD");
            dto.setPatientId(ipd.getPatientId());
            dto.setDoctorId(ipd.getDoctorId());
            dto.setStatus(ipd.getStatus());
            dto.setCreatedAt(ipd.getCreatedAt() != null ? ipd.getCreatedAt().toString() : null);
            result.add(dto);
        });
        return result;
    }

    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    @PostMapping("/return")
    public PharmacySale processReturn(@RequestParam Long saleId, @RequestParam Long saleItemId, @RequestParam int quantity) {
        return saleService.processReturn(saleId, saleItemId, quantity);
    }
}
