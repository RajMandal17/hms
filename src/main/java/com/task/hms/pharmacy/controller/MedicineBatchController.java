package com.task.hms.pharmacy.controller;

import com.task.hms.pharmacy.model.MedicineBatch;
import com.task.hms.pharmacy.service.MedicineBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/medicines/{medicineId}/batches")
public class MedicineBatchController {

    @Autowired
    private MedicineBatchService batchService;

    @GetMapping
    public List<MedicineBatch> getBatches(@PathVariable Long medicineId) {
        return batchService.getBatchesByMedicineId(medicineId);
    }

    @PostMapping
    public MedicineBatch addBatch(@PathVariable Long medicineId, @RequestBody MedicineBatch batch) {
        return batchService.addBatchToMedicine(medicineId, batch);
    }

    @PutMapping("/{batchId}")
    public MedicineBatch updateBatch(@PathVariable Long batchId, @RequestBody MedicineBatch batch) {
        return batchService.updateBatch(batchId, batch);
    }

    @DeleteMapping("/{batchId}")
    public void deleteBatch(@PathVariable Long batchId) {
        batchService.deleteBatch(batchId);
    }
}
