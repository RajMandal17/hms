package com.task.hms.ipd.service.impl;

import com.task.hms.ipd.dto.IPDVitalsDTO;
import com.task.hms.ipd.model.IPDVitals;
import com.task.hms.ipd.model.IPDAdmission;
import com.task.hms.ipd.service.IPDVitalsService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IPDVitalsServiceImpl implements IPDVitalsService {
    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public IPDVitalsDTO addVitals(IPDVitalsDTO dto) {
        IPDAdmission admission = em.find(IPDAdmission.class, dto.getAdmissionId());
        IPDVitals vitals = new IPDVitals();
        vitals.setAdmission(admission);
        vitals.setTimestamp(dto.getTimestamp());
        vitals.setBp(dto.getBp());
        vitals.setPulse(dto.getPulse());
        vitals.setTemperature(dto.getTemperature());
        vitals.setNurseId(dto.getNurseId());
        em.persist(vitals);
        dto.setId(vitals.getId());
        return dto;
    }

    @Override
    public List<IPDVitalsDTO> getVitalsByAdmission(Long admissionId) {
        List<IPDVitals> list = em.createQuery("SELECT v FROM IPDVitals v WHERE v.admission.id = :admissionId ORDER BY v.timestamp DESC", IPDVitals.class)
                .setParameter("admissionId", admissionId)
                .getResultList();
        return list.stream().map(v -> {
            IPDVitalsDTO dto = new IPDVitalsDTO();
            dto.setId(v.getId());
            dto.setAdmissionId(admissionId);
            dto.setTimestamp(v.getTimestamp());
            dto.setBp(v.getBp());
            dto.setPulse(v.getPulse());
            dto.setTemperature(v.getTemperature());
            dto.setNurseId(v.getNurseId());
            return dto;
        }).collect(Collectors.toList());
    }
}
