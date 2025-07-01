package com.task.hms.pharmacy.controller;

import com.task.hms.pharmacy.model.PharmacyReturn;
import com.task.hms.pharmacy.service.PharmacyReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/returns")
public class PharmacyReturnController {

    @Autowired
    private PharmacyReturnService returnService;

    @PostMapping
    public PharmacyReturn createReturn(@RequestBody PharmacyReturn pharmacyReturn) {
        return returnService.createReturn(pharmacyReturn);
    }

    @GetMapping("/{id}")
    public PharmacyReturn getReturnById(@PathVariable Long id) {
        return returnService.getReturnById(id);
    }

    @GetMapping
    public List<PharmacyReturn> getAllReturns() {
        return returnService.getAllReturns();
    }

    @PutMapping("/{id}")
    public PharmacyReturn updateReturn(@PathVariable Long id, @RequestBody PharmacyReturn pharmacyReturn) {
        return returnService.updateReturn(id, pharmacyReturn);
    }

    @DeleteMapping("/{id}")
    public void deleteReturn(@PathVariable Long id) {
        returnService.deleteReturn(id);
    }
}
