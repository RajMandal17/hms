package com.task.hms.ipd.service.impl;

import com.task.hms.ipd.dto.IPDDoctorRoundDTO;
import com.task.hms.ipd.model.IPDDoctorRound;
import com.task.hms.ipd.model.IPDAdmission;
import com.task.hms.ipd.service.IPDDoctorRoundService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IPDDoctorRoundServiceImpl implements IPDDoctorRoundService {
    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public IPDDoctorRoundDTO addDoctorRound(IPDDoctorRoundDTO dto) {
        IPDAdmission admission = em.find(IPDAdmission.class, dto.getAdmissionId());
        IPDDoctorRound round = new IPDDoctorRound();
        round.setAdmission(admission);
        round.setTimestamp(dto.getTimestamp());
        round.setDoctorId(dto.getDoctorId());
        round.setNotes(dto.getNotes());
        em.persist(round);
        dto.setId(round.getId());
        return dto;
    }

    @Override
    public List<IPDDoctorRoundDTO> getRoundsByAdmission(Long admissionId) {
        List<IPDDoctorRound> list = em.createQuery("SELECT r FROM IPDDoctorRound r WHERE r.admission.id = :admissionId ORDER BY r.timestamp DESC", IPDDoctorRound.class)
                .setParameter("admissionId", admissionId)
                .getResultList();
        return list.stream().map(r -> {
            IPDDoctorRoundDTO dto = new IPDDoctorRoundDTO();
            dto.setId(r.getId());
            dto.setAdmissionId(admissionId);
            dto.setTimestamp(r.getTimestamp());
            dto.setDoctorId(r.getDoctorId());
            dto.setNotes(r.getNotes());
            return dto;
        }).collect(Collectors.toList());
    }
}
