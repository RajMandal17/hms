package com.task.hms.ipd.service;

import com.task.hms.ipd.model.Bed;
import java.util.List;

public interface BedService {
    Bed createBed(Bed bed);
    Bed updateBed(Long id, Bed bed);
    void deleteBed(Long id);
    Bed getBedById(Long id);
    List<Bed> getAllBeds();
    List<Bed> getBedsByWard(Long wardId);
    Bed assignBedToPatient(Long bedId);
    Bed vacateBed(Long bedId);
    Bed markBedForCleaning(Long bedId);
}
