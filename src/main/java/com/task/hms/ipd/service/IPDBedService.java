package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.*;
import java.util.List;

import com.task.hms.ipd.model.IPDBed;

public interface IPDBedService {
    List<IPDBedDTO> getAllBeds();
    IPDBedDTO getBed(Long id);
    IPDBedDTO createBed(IPDBedDTO bedDTO);
    IPDBedDTO updateBed(Long id, IPDBedDTO bedDTO);
    void deleteBed(Long id);
    IPDBedDTO updateBedStatus(Long id, String status);
    List<IPDBedDTO> getAvailableBedsByWard(Long wardId);
}
