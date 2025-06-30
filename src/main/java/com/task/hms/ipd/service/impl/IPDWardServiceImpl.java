package com.task.hms.ipd.service.impl;

import com.task.hms.ipd.dto.*;
import com.task.hms.ipd.model.IPDWard;
import com.task.hms.ipd.model.IPDBed;
import com.task.hms.ipd.dto.BedStatus;
import com.task.hms.ipd.repository.IPDWardRepository;
import com.task.hms.ipd.repository.IPDBedRepository;
import com.task.hms.ipd.service.IPDWardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IPDWardServiceImpl implements IPDWardService {
    @Autowired
    private IPDWardRepository wardRepository;
    @Autowired
    private IPDBedRepository bedRepository;

    @Override
    public List<IPDWardDTO> getAllWards() {
        return wardRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public IPDWardDTO getWard(Long id) {
        return wardRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    @Override
    public IPDWardDTO addWardWithBeds(WardWithBedsDTO dto) {
        IPDWard ward = new IPDWard();
        ward.setName(dto.getName());
        ward.setType(dto.getType());
        ward = wardRepository.save(ward);
        for (int i = 1; i <= dto.getBedCount(); i++) {
            IPDBed bed = new IPDBed();
            bed.setWardId(ward.getId());
            bed.setBedNumber("Bed " + i);
            bed.setStatus(BedStatus.VACANT);
            bedRepository.save(bed);
        }
        return mapToDTO(ward);
    }

    private IPDWardDTO mapToDTO(IPDWard ward) {
        IPDWardDTO dto = new IPDWardDTO();
        dto.setId(ward.getId());
        dto.setName(ward.getName());
        dto.setType(ward.getType());
        return dto;
    }
}
