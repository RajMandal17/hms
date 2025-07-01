package com.task.hms.pharmacy.service.impl;

import com.task.hms.pharmacy.model.PharmacyReturn;
import com.task.hms.pharmacy.repository.PharmacyReturnRepository;
import com.task.hms.pharmacy.repository.PharmacySaleItemRepository;
import com.task.hms.pharmacy.repository.PharmacyReturnItemRepository;
import com.task.hms.pharmacy.repository.MedicineBatchRepository;
import com.task.hms.pharmacy.service.PharmacyReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.task.hms.pharmacy.model.PharmacyReturnItem;

@Service
public class PharmacyReturnServiceImpl implements PharmacyReturnService {


    @Autowired
    private PharmacyReturnRepository returnRepository;

    @Autowired
    private PharmacySaleItemRepository saleItemRepository;

    @Autowired
    private PharmacyReturnItemRepository returnItemRepository;

    @Autowired
    private MedicineBatchRepository batchRepository;

    @Override
    public PharmacyReturn createReturn(PharmacyReturn pharmacyReturn) {
        for (PharmacyReturnItem item : pharmacyReturn.getItems()) {
            // 1. Fetch the original sale item for this batch and sale
            var saleItem = saleItemRepository.findBySaleIdAndMedicineBatchId(
                pharmacyReturn.getSale().getId(), item.getMedicineBatch().getId()
            ).orElseThrow(() -> new RuntimeException("Original sale item not found"));

            // 2. Sum up all previous returns for this sale item and batch
            Integer totalReturnedSoFar = returnItemRepository
                .sumReturnedQuantityBySaleIdAndBatchId(
                    pharmacyReturn.getSale().getId(), item.getMedicineBatch().getId()
                );
            if (totalReturnedSoFar == null) totalReturnedSoFar = 0;

            // 3. Check if the new return would exceed the original sale quantity
            if (totalReturnedSoFar + item.getQuantity() > saleItem.getQuantity()) {
                throw new RuntimeException("Return quantity exceeds quantity sold for batch " + saleItem.getMedicineBatch().getBatchNumber());
            }

            // 4. Add returned quantity back to stock
            var batch = batchRepository.findById(item.getMedicineBatch().getId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));
            batch.setQuantity(batch.getQuantity() + item.getQuantity());
            batchRepository.save(batch);
        }
        return returnRepository.save(pharmacyReturn);
    }

    @Override
    public PharmacyReturn getReturnById(Long id) {
        Optional<PharmacyReturn> pharmacyReturn = returnRepository.findById(id);
        return pharmacyReturn.orElse(null);
    }

    @Override
    public List<PharmacyReturn> getAllReturns() {
        return returnRepository.findAll();
    }

    @Override
    public PharmacyReturn updateReturn(Long id, PharmacyReturn pharmacyReturn) {
        if (!returnRepository.existsById(id)) {
            return null;
        }
        pharmacyReturn.setId(id);
        return returnRepository.save(pharmacyReturn);
    }

    @Override
    public void deleteReturn(Long id) {
        returnRepository.deleteById(id);
    }
}
