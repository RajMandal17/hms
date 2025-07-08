package com.task.hms.ipd.service.impl;

import com.task.hms.ipd.dto.*;
import com.task.hms.ipd.model.IPDAdmission;
import com.task.hms.ipd.model.IPDBed;
import com.task.hms.ipd.dto.BedStatus;
import com.task.hms.ipd.repository.IPDAdmissionRepository;
import com.task.hms.ipd.repository.IPDBedRepository;
import com.task.hms.ipd.service.IPDAdmissionService;
import com.task.hms.opd.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IPDAdmissionServiceImpl implements IPDAdmissionService {
    @Autowired
    private IPDAdmissionRepository admissionRepository;

    @Autowired
    private IPDBedRepository bedRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    @Transactional
    public IPDAdmissionResponseDTO admitPatient(IPDAdmissionRequestDTO request) {
        IPDBed bed = bedRepository.findById(request.getBedId())
            .orElseThrow(() -> new RuntimeException("Bed not found"));
        if (bed.getStatus() != BedStatus.VACANT) {
            throw new RuntimeException("Bed already occupied");
        }
        bed.setStatus(BedStatus.OCCUPIED);
        bedRepository.save(bed);
        IPDAdmission admission = new IPDAdmission();
        admission.setPatientId(request.getPatientId());
        admission.setDoctorId(request.getDoctorId());
        admission.setWardId(request.getWardId());
        // Set the bed relationship
        IPDBed bedS = bedRepository.findById(request.getBedId())
                    .orElseThrow(() -> new RuntimeException("Bed not available"));
        admission.setBed(bedS);
        admission.setAttendantName(request.getAttendantName());
        admission.setAttendantContact(request.getAttendantContact());
        admission.setAdmissionNotes(request.getAdmissionNotes());
        admission.setInsuranceDetails(request.getInsuranceDetails());
        admission.setInitialDeposit(request.getInitialDeposit());
        admission.setStatus(AdmissionStatus.ADMITTED);
        // Use provided admissionDate if present, else now
        if (request.getAdmissionDate() != null) {
            admission.setAdmissionDate(request.getAdmissionDate());
        } else {
            admission.setAdmissionDate(LocalDateTime.now());
        }
        admission = admissionRepository.save(admission);
        return mapToResponseDTO(admission);
    }

    @Override
    public List<IPDAdmissionResponseDTO> getAllAdmissions() {
        return admissionRepository.findAll().stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public IPDAdmissionResponseDTO getAdmission(Long id) {
        return admissionRepository.findById(id).map(this::mapToResponseDTO).orElse(null);
    }

    @Override
    @Transactional
    public void dischargePatient(Long id) {
        admissionRepository.findById(id).ifPresent(admission -> {
            admission.setStatus(AdmissionStatus.DISCHARGED);
            admission.setDischargeDate(LocalDateTime.now());
            admissionRepository.save(admission);
            // Set bed status to CLEANING after discharge
            if (admission.getBed() != null) {
                IPDBed bed = admission.getBed();
                bed.setStatus(BedStatus.CLEANING);
                bedRepository.save(bed);
            }
        });
    }

    @Override
    @Transactional
    public IPDAdmissionResponseDTO updateAdmission(IPDAdmissionUpdateRequestDTO request) {
        IPDAdmission admission = admissionRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Admission not found"));
        if (request.getDischargeDate() != null) {
            admission.setDischargeDate(request.getDischargeDate());
        }
        if (request.getDischargeSummary() != null) {
            admission.setDischargeSummary(request.getDischargeSummary());
        }
        if (request.getDischargeTime() != null) {
            admission.setDischargeTime(request.getDischargeTime());
        }
        if (request.getTotalBill() != null) {
            admission.setTotalBill(request.getTotalBill());
        }
//        if (request.getBedId() != null) {
//            IPDBed bed = bedRepository.findById(request.getBedId())
//                    .orElseThrow(() -> new RuntimeException("Bed not found"));
//            admission.setBed(bed);
//        }
        admission = admissionRepository.save(admission);
        return mapToResponseDTO(admission);
    }

    private IPDAdmissionResponseDTO mapToResponseDTO(IPDAdmission admission) {
        IPDAdmissionResponseDTO dto = new IPDAdmissionResponseDTO();
        dto.setId(admission.getId());
        dto.setPatientId(admission.getPatientId());
        // Fetch patient name for display
        if (admission.getPatientId() != null) {
            patientRepository.findById(admission.getPatientId())
                .ifPresentOrElse(
                    p -> dto.setPatientName(p.getName()),
                    () -> dto.setPatientName("Unknown")
                );
        } else {
            dto.setPatientName("Unknown");
        }
        dto.setDoctorId(admission.getDoctorId());
        dto.setWardId(admission.getWardId());
        dto.setBedId(admission.getBed() != null ? admission.getBed().getId() : null);
        dto.setAttendantName(admission.getAttendantName());
        dto.setAttendantContact(admission.getAttendantContact());
        dto.setAdmissionNotes(admission.getAdmissionNotes());
        dto.setInsuranceDetails(admission.getInsuranceDetails());
        dto.setInitialDeposit(admission.getInitialDeposit());
        dto.setStatus(admission.getStatus());
        dto.setAdmissionDate(admission.getAdmissionDate());
        dto.setDischargeDate(admission.getDischargeDate());
        dto.setDischargeSummary(admission.getDischargeSummary());
        dto.setDischargeTime(admission.getDischargeTime());
        dto.setTotalBill(admission.getTotalBill());
        return dto;
    }
}
