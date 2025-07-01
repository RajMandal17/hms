package com.task.hms.pharmacy.controller;

import com.task.hms.pharmacy.model.MedicineBatch;
import com.task.hms.pharmacy.service.MedicineBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/batches")
public class PharmacyBatchController {
    @Autowired
    private MedicineBatchService batchService;

    @GetMapping("/low-stock")
    public List<MedicineBatch> getLowStockBatches(@RequestParam(defaultValue = "10") int threshold) {
        return batchService.getLowStockBatches(threshold);
    }

    @GetMapping("/expiring")
    public List<MedicineBatch> getExpiringBatches(@RequestParam(defaultValue = "30") int daysAhead) {
        return batchService.getExpiringBatches(daysAhead);
    }
}
