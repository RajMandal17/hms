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
class IPDBedController {
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

}
