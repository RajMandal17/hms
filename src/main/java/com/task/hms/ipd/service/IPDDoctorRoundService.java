package com.task.hms.ipd.service;

import com.task.hms.ipd.dto.IPDDoctorRoundDTO;
import java.util.List;

public interface IPDDoctorRoundService {
    IPDDoctorRoundDTO addDoctorRound(IPDDoctorRoundDTO dto);
    List<IPDDoctorRoundDTO> getRoundsByAdmission(Long admissionId);
}
