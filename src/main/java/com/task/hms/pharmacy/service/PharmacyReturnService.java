package com.task.hms.pharmacy.service;

import com.task.hms.pharmacy.model.PharmacyReturn;
import java.util.List;

public interface PharmacyReturnService {
    PharmacyReturn createReturn(PharmacyReturn pharmacyReturn);
    PharmacyReturn getReturnById(Long id);
    List<PharmacyReturn> getAllReturns();
    PharmacyReturn updateReturn(Long id, PharmacyReturn pharmacyReturn);
    void deleteReturn(Long id);
}
