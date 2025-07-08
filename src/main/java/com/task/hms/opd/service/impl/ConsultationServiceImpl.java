package com.task.hms.opd.service.impl;

import com.task.hms.opd.dto.ConsultationRequest;
import com.task.hms.opd.dto.ConsultationResponseDTO;
import com.task.hms.opd.dto.MedicineDTO;
import com.task.hms.opd.model.Consultation;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.repository.ConsultationRepository;
import com.task.hms.opd.repository.AppointmentRepository;
import com.task.hms.opd.repository.PatientRepository;
import com.task.hms.opd.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultationServiceImpl implements ConsultationService {
    @Autowired
    private ConsultationRepository consultationRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;

    @Override
    @Transactional
    public Consultation addConsultation(ConsultationRequest request) {
        // Debug: Log incoming medicines for troubleshooting null values
        try {
            System.out.println("Received medicines: " + new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(request.getMedicines()));
        } catch (Exception e) {
            System.out.println("Could not log medicines: " + e.getMessage());
        }
        Consultation consultation = new Consultation();
        consultation.setAppointmentId(request.getAppointmentId());
        // Fetch the appointment and set doctorName from it
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        consultation.setDoctorName(appointment.getDoctorName());
        consultation.setConsultationTime(java.time.LocalDateTime.now());
        consultation.setNotes(request.getNotes());
        consultation.setDiagnosis(request.getDiagnosis());
        consultation.setPrescription(request.getPrescription());
        consultation.setSymptoms(request.getSymptoms());
        consultation.setFollowUpDate(request.getFollowUpDate());
        consultation.setFee(request.getFee());
      //  consultation.setMedicines(request.getMedicines());

        // Handle medicines as BillItems (using ConsultationRequest.MedicineDTO)
        java.util.List<com.task.hms.billing.model.BillItem> medicines = new java.util.ArrayList<>();
        double total = 0.0;
        if (request.getMedicines() != null) {
            for (ConsultationRequest.MedicineDTO medDto : request.getMedicines()) {
                medDto.setTotal(medDto.getTotal()*medDto.getQuantity());
                com.task.hms.billing.model.BillItem med = new com.task.hms.billing.model.BillItem();
                med.setDescription(medDto.getName() + (medDto.getQuantity() != null ? " x" + medDto.getQuantity() : ""));
                // Defensive conversion for amount
                Double amount = 0.0;
                try {
                    Double totalField = medDto.getTotal();
                    Integer quantityField = medDto.getQuantity();
                    if (totalField != null && quantityField != null && quantityField > 0) {
                        amount = totalField;
                    } else if (totalField != null) {
                        amount = totalField;
                    }
                } catch (Exception e) {
                    amount = 0.0;
                }
                med.setAmount(amount);
                med.setSourceType("MEDICINE");
                medicines.add(med);
                total += amount;
            }
        }
        consultation.setMedicines(medicines);

        // Create and link Bill
        com.task.hms.billing.model.Bill bill = new com.task.hms.billing.model.Bill();
        bill.setPatientId(appointment.getPatientId()); // Use actual patient ID from appointment
        bill.setBillType("OPD");
        bill.setStatus("PENDING");
        bill.setItems(medicines);
        bill.setTotalAmount(total);
        bill.setPaidAmount(0.0); // Set paidAmount to 0 for new bills
        bill.setWalkInPatientId(null); // Or set as needed
        consultation.setBill(bill);
        for (com.task.hms.billing.model.BillItem med : medicines) {
            med.setBill(bill);
        }

        return consultationRepository.save(consultation);
    }

    @Override
    public ConsultationResponseDTO mapToResponseDTO(Consultation consultation) {
        ConsultationResponseDTO dto = new ConsultationResponseDTO();
        dto.setId(consultation.getId());
        dto.setAppointmentId(consultation.getAppointmentId());
        dto.setDoctorName(consultation.getDoctorName());
        dto.setSymptoms(consultation.getSymptoms());
        dto.setDiagnosis(consultation.getDiagnosis());
        dto.setNotes(consultation.getNotes());
        dto.setPrescription(consultation.getPrescription());
        dto.setConsultationTime(consultation.getConsultationTime());
        dto.setFee(consultation.getFee());
        // Convert followUpDate from String to LocalDate
        if (consultation.getFollowUpDate() != null && !consultation.getFollowUpDate().isEmpty()) {
            dto.setFollowUpDate(java.time.LocalDate.parse(consultation.getFollowUpDate()));
        } else {
            dto.setFollowUpDate(null);
        }
        // Fetch appointment and patient for names
        Appointment appointment = appointmentRepository.findById(consultation.getAppointmentId()).orElse(null);
        if (appointment != null) {
            dto.setPatientId(appointment.getPatientId());
            Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
            if (patient != null) dto.setPatientName(patient.getName());
        }
        // Map medicines from BillItems to MedicineDTOs
        if (consultation.getMedicines() != null && !consultation.getMedicines().isEmpty()) {
            List<MedicineDTO> medicines = consultation.getMedicines().stream().map(billItem -> {
                MedicineDTO medDto = new MedicineDTO();
                // Try to parse name and quantity from description ("name xQTY")
                String desc = billItem.getDescription();
                if (desc != null && desc.contains(" x")) {
                    int idx = desc.lastIndexOf(" x");
                    medDto.setName(desc.substring(0, idx));
                    try {
                        medDto.setQuantity(Integer.parseInt(desc.substring(idx + 2)));
                    } catch (Exception e) {
                        medDto.setQuantity(null);
                    }
                } else {
                    medDto.setName(desc);
                    medDto.setQuantity(null);
                }
                medDto.setTotal(billItem.getAmount());
                return medDto;
            }).collect(java.util.stream.Collectors.toList());
            dto.setMedicines(medicines);
        } else {
            dto.setMedicines(null);
        }
        return dto;
    }

    @Override
    public List<ConsultationResponseDTO> getConsultationsByPatientId(String patientId) {
        Long patientIdLong = Long.valueOf(patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientIdLong);
        List<Long> appointmentIds = appointments.stream().map(Appointment::getId).collect(Collectors.toList());
        return consultationRepository.findAll().stream()
                .filter(c -> appointmentIds.contains(c.getAppointmentId()))
                .sorted((a, b) -> b.getConsultationTime().compareTo(a.getConsultationTime()))
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsultationResponseDTO> getAllConsultations() {
        return consultationRepository.findAll().stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Consultation> updateConsultation(Long id, ConsultationRequest request) {
        return consultationRepository.findById(id).map(consultation -> {
            consultation.setAppointmentId(request.getAppointmentId());
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            consultation.setDoctorName(appointment.getDoctorName());
            consultation.setNotes(request.getNotes());
            consultation.setDiagnosis(request.getDiagnosis());
            consultation.setPrescription(request.getPrescription());
            consultation.setSymptoms(request.getSymptoms());
            consultation.setFollowUpDate(request.getFollowUpDate());
            consultation.setFee(request.getFee());

            // Update medicines as BillItems (using ConsultationRequest.MedicineDTO)
            java.util.List<com.task.hms.billing.model.BillItem> medicines = new java.util.ArrayList<>();
            double total = 0.0;
            if (request.getMedicines() != null) {
                for (ConsultationRequest.MedicineDTO medDto : request.getMedicines()) {
                    com.task.hms.billing.model.BillItem med = new com.task.hms.billing.model.BillItem();
                    med.setDescription(medDto.getName() + (medDto.getQuantity() != null ? " x" + medDto.getQuantity() : ""));
                    // Use total as the total price for the bill item (not price per unit)
                    Double amount = medDto.getTotal() != null ? medDto.getTotal() : 0.0;
                    med.setAmount(amount);
                    med.setSourceType("MEDICINE");
                    medicines.add(med);
                    total += med.getAmount();
                }
            }
            consultation.setMedicines(medicines);

            // Update and link Bill
            com.task.hms.billing.model.Bill bill = consultation.getBill();
            if (bill == null) {
                bill = new com.task.hms.billing.model.Bill();
            }
            bill.setPatientId(appointment.getPatientId()); // Use actual patient ID from appointment
            bill.setBillType("OPD");
            bill.setStatus("PENDING");
            bill.setItems(medicines);
            bill.setTotalAmount(total);
            bill.setPaidAmount(0.0); // Set paidAmount to 0 for new/updated bills
            bill.setWalkInPatientId(null); // Or set as needed
            consultation.setBill(bill);
            for (com.task.hms.billing.model.BillItem med : medicines) {
                med.setBill(bill);
            }

            return consultationRepository.save(consultation);
        });
    }

    @Override
    @Transactional
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

    @Override
    public Page<Consultation> getConsultationsPaged(Pageable pageable, String doctorName, Long appointmentId) {
        if (doctorName != null && appointmentId != null) {
            return consultationRepository.findByDoctorNameContainingIgnoreCaseAndAppointmentId(doctorName, appointmentId, pageable);
        } else if (doctorName != null) {
            return consultationRepository.findByDoctorNameContainingIgnoreCase(doctorName, pageable);
        } else if (appointmentId != null) {
            return consultationRepository.findByAppointmentId(appointmentId, pageable);
        } else {
            return consultationRepository.findAll(pageable);
        }
    }

    @Override
    public Patient getPatientById(String patientId) {
        return patientRepository.findById(Long.valueOf(patientId)).orElse(null);
    }

    @Override
    public double calculateBillForPatient(String patientId) {
        // Dummy implementation: sum up a fixed amount per consultation
        List<ConsultationResponseDTO> consultations = getConsultationsByPatientId(patientId);
        return consultations.size() * 500.0; // e.g., Rs. 500 per consultation
    }
}
