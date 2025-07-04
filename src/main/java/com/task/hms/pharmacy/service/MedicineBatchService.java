package com.task.hms.pharmacy.service;

import com.task.hms.pharmacy.model.MedicineBatch;
import java.util.List;

import java.time.LocalDate;

public interface MedicineBatchService {
    List<MedicineBatch> getBatchesByMedicineId(Long medicineId);
    MedicineBatch addBatchToMedicine(Long medicineId, MedicineBatch batch);
    MedicineBatch updateBatch(Long batchId, MedicineBatch batch);
    void deleteBatch(Long batchId);

    List<MedicineBatch> getLowStockBatches(int threshold);
    List<MedicineBatch> getExpiringBatches(int daysAhead);
    List<MedicineBatch> getAllBatches();
}
