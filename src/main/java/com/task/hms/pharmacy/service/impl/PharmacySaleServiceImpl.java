package com.task.hms.pharmacy.service.impl;

import com.task.hms.pharmacy.model.PharmacySale;
import com.task.hms.pharmacy.repository.PharmacySaleRepository;
import com.task.hms.pharmacy.service.PharmacySaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PharmacySaleServiceImpl implements PharmacySaleService {

    @Autowired
    private PharmacySaleRepository saleRepository;

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
}
