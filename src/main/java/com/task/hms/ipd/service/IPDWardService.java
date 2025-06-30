package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.*;
import java.util.List;

public interface IPDWardService {
    List<IPDWardDTO> getAllWards();
    IPDWardDTO getWard(Long id);
    IPDWardDTO addWardWithBeds(WardWithBedsDTO dto);
    // Add more as needed
}
