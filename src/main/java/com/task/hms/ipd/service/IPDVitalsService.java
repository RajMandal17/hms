package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.IPDVitalsDTO;
import java.util.List;

public interface IPDVitalsService {
    IPDVitalsDTO addVitals(IPDVitalsDTO dto);
    List<IPDVitalsDTO> getVitalsByAdmission(Long admissionId);
}
