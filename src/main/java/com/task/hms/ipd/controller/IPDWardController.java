package com.task.hms.ipd.controller;

import com.task.hms.ipd.dto.IPDBedDTO;
import com.task.hms.ipd.dto.IPDWardDTO;
import com.task.hms.ipd.dto.WardWithBedsDTO;
import com.task.hms.ipd.service.IPDBedService;
import com.task.hms.ipd.service.IPDWardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ipd/wards")
public class IPDWardController {
    @Autowired
    private IPDWardService wardService;

    @GetMapping
    public List<IPDWardDTO> getAllWards() {
        return wardService.getAllWards();
    }

    @PostMapping
    public IPDWardDTO addWardWithBeds(@RequestBody WardWithBedsDTO dto) {
        return wardService.addWardWithBeds(dto);
    }
}



