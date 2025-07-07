package com.task.hms.pharmacy.controller;

import com.task.hms.pharmacy.dto.MedicineBatchCreateRequest;
import com.task.hms.pharmacy.model.MedicineBatch;
import com.task.hms.pharmacy.service.MedicineBatchService;
import com.task.hms.pharmacy.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/pharmacy/batches")
public class PharmacyBatchController {
    @Autowired
    private MedicineBatchService batchService;

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping("/low-stock")
    public List<MedicineBatch> getLowStockBatches(@RequestParam(defaultValue = "10") int threshold) {
        return batchService.getLowStockBatches(threshold);
    }

    @GetMapping("/expiring")
    public List<MedicineBatch> getExpiringBatches(@RequestParam(defaultValue = "30") int daysAhead) {
        return batchService.getExpiringBatches(daysAhead);
    }

    @GetMapping("")
    public List<MedicineBatch> getAllBatches() {
        return batchService.getAllBatches();
    }

    @PostMapping
    public MedicineBatch addBatch(@RequestBody MedicineBatchCreateRequest req) {
        if (req.getMedicineId() == null) {
            throw new IllegalArgumentException("Medicine ID is required");
        }
        MedicineBatch batch = new MedicineBatch();
        batch.setBatchNumber(req.getBatchNumber());
        batch.setExpiryDate(LocalDate.parse(req.getExpiryDate()));
        batch.setQuantity(req.getStock());
        batch.setPurchasePrice(req.getPurchasePrice());
        batch.setSalePrice(req.getSalePrice());
        batch.setCreatedAt(req.getCreatedAt() != null && !req.getCreatedAt().isEmpty() ? LocalDate.parse(req.getCreatedAt()) : LocalDate.now());
        // Set the medicine entity from the medicineId
        batch.setMedicine(medicineRepository.findById(req.getMedicineId()).orElseThrow(() -> new IllegalArgumentException("Invalid medicineId")));
        return batchService.addBatchToMedicine(req.getMedicineId(), batch);
    }

    @PutMapping("/{id}")
    public MedicineBatch updateBatch(@PathVariable Long id, @RequestBody MedicineBatchCreateRequest req) {
        if (req.getMedicineId() == null) {
            throw new IllegalArgumentException("Medicine ID is required");
        }
        MedicineBatch batch = new MedicineBatch();
        batch.setBatchNumber(req.getBatchNumber());
        batch.setExpiryDate(java.time.LocalDate.parse(req.getExpiryDate()));
        batch.setQuantity(req.getStock());
        batch.setPurchasePrice(req.getPurchasePrice());
        batch.setSalePrice(req.getSalePrice());
        batch.setCreatedAt(req.getCreatedAt() != null && !req.getCreatedAt().isEmpty() ? java.time.LocalDate.parse(req.getCreatedAt()) : java.time.LocalDate.now());
        // Set the medicine entity from the medicineId
        batch.setMedicine(medicineRepository.findById(req.getMedicineId()).orElseThrow(() -> new IllegalArgumentException("Invalid medicineId")));
        return batchService.updateBatch(id, batch);
    }
}
