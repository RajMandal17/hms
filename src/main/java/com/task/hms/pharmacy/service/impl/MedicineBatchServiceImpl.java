package com.task.hms.pharmacy.service.impl;

import com.task.hms.pharmacy.model.Medicine;
import com.task.hms.pharmacy.model.MedicineBatch;
import com.task.hms.pharmacy.repository.MedicineBatchRepository;
import com.task.hms.pharmacy.repository.MedicineRepository;
import com.task.hms.pharmacy.service.MedicineBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import java.time.LocalDate;
@Service

public class MedicineBatchServiceImpl implements MedicineBatchService {

    @Autowired
    private MedicineBatchRepository batchRepository;
    @Autowired
    private MedicineRepository medicineRepository;

    @Override
    public List<MedicineBatch> getBatchesByMedicineId(Long medicineId) {
        Optional<Medicine> medicine = medicineRepository.findById(medicineId);
        return medicine.map(Medicine::getBatches).orElse(null);
    }

    @Override
    public List<MedicineBatch> getLowStockBatches(int threshold) {
        return batchRepository.findByQuantityLessThan(threshold);
    }

    @Override
    public List<MedicineBatch> getExpiringBatches(int daysAhead) {
        LocalDate cutoff = LocalDate.now().plusDays(daysAhead);
        return batchRepository.findByExpiryDateBefore(cutoff);
    }

    @Override
    public MedicineBatch addBatchToMedicine(Long medicineId, MedicineBatch batch) {
        // Do not overwrite the medicine if already set by the controller
        if (batch.getMedicine() == null) {
            Optional<Medicine> medicine = medicineRepository.findById(medicineId);
            if (medicine.isPresent()) {
                batch.setMedicine(medicine.get());
            } else {
                return null;
            }
        }
        return batchRepository.save(batch);
    }

    @Override
    public MedicineBatch updateBatch(Long batchId, MedicineBatch batch) {
        if (!batchRepository.existsById(batchId)) {
            return null;
        }
        batch.setId(batchId);
        // Do not overwrite the medicine if already set by the controller
        return batchRepository.save(batch);
    }

    @Override
    public void deleteBatch(Long batchId) {
        batchRepository.deleteById(batchId);
    }

    @Override
    public List<MedicineBatch> getAllBatches() {
        return batchRepository.findAll();
    }
}
