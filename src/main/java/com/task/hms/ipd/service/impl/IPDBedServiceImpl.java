package com.task.hms.ipd.service.impl;

import com.task.hms.ipd.dto.*;
import com.task.hms.ipd.model.IPDBed;
import com.task.hms.ipd.repository.IPDBedRepository;
import com.task.hms.ipd.service.IPDBedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IPDBedServiceImpl implements IPDBedService {
    @Autowired
    private IPDBedRepository bedRepository;

    @Override
    public List<IPDBedDTO> getAllBeds() {
        return bedRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public IPDBedDTO getBed(Long id) {
        return bedRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    @Override
    public IPDBedDTO updateBedStatus(Long id, String status) {
        return bedRepository.findById(id).map(bed -> {
            bed.setStatus(BedStatus.valueOf(status));
            bedRepository.save(bed);
            return mapToDTO(bed);
        }).orElse(null);
    }

    @Override
    public List<IPDBedDTO> getAvailableBedsByWard(Long wardId) {
        return bedRepository.findAll().stream()
            .filter(bed -> bed.getWardId().equals(wardId) && bed.getStatus() == BedStatus.VACANT)
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    private IPDBedDTO mapToDTO(IPDBed bed) {
        IPDBedDTO dto = new IPDBedDTO();
        dto.setId(bed.getId());
        dto.setWardId(bed.getWardId());
        dto.setBedNumber(bed.getBedNumber());
        dto.setStatus(bed.getStatus());
        return dto;
    }
}
