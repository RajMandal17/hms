package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.*;
import java.util.List;

public interface IPDBedService {
    List<IPDBedDTO> getAllBeds();
    IPDBedDTO getBed(Long id);
    IPDBedDTO updateBedStatus(Long id, String status);
    List<IPDBedDTO> getAvailableBedsByWard(Long wardId);
    // Add more as needed
}
