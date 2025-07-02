package com.task.hms.ipd.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.task.hms.ipd.dto.IPDBedDTO;
import com.task.hms.ipd.service.IPDBedService;  
@RestController
@RequestMapping("/api/ipd/beds")
public class IPDBedController {
    @Autowired
    private IPDBedService bedService;

    @GetMapping
    public List<IPDBedDTO> getAllBeds() {
        return bedService.getAllBeds();
    }

    @GetMapping("/available")
    public List<IPDBedDTO> getAvailableBedsByWard(@RequestParam Long wardId) {
        return bedService.getAvailableBedsByWard(wardId);
    }

    @GetMapping("/{id}")
    public IPDBedDTO getBed(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return bedService.getBed(id);
    }

    @org.springframework.web.bind.annotation.PostMapping
    public IPDBedDTO createBed(@org.springframework.web.bind.annotation.RequestBody IPDBedDTO bedDTO) {
        return bedService.createBed(bedDTO);
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public IPDBedDTO updateBed(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody IPDBedDTO bedDTO) {
        return bedService.updateBed(id, bedDTO);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public void deleteBed(@org.springframework.web.bind.annotation.PathVariable Long id) {
        bedService.deleteBed(id);
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}/status")
    public IPDBedDTO updateBedStatus(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestParam String status) {
        return bedService.updateBedStatus(id, status);
    }
}
