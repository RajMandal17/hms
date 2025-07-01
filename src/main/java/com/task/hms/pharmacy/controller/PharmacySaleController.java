package com.task.hms.pharmacy.controller;

import com.task.hms.pharmacy.model.PharmacySale;
import com.task.hms.pharmacy.service.PharmacySaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/sales")
public class PharmacySaleController {

    @Autowired
    private PharmacySaleService saleService;

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
}
