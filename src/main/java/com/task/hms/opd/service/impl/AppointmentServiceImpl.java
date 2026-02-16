package com.task.hms.opd.service.impl;

import com.task.hms.opd.model.Patient;
import com.task.hms.opd.repository.PatientRepository;
import com.task.hms.notification.NotificationService;

import com.task.hms.opd.dto.AppointmentRequest;
import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.repository.AppointmentRepository;
import com.task.hms.opd.service.AppointmentService;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(request.getStatus() != null ? request.getStatus() : Appointment.Status.SCHEDULED);
        // Set doctorName from User
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        appointment.setDoctorName(doctor.getUsername()); // or use getFirstName() + " " + getLastName() if available
        // Send email and SMS notification to patient (if available)
        patientRepository.findById(request.getPatientId()).ifPresent(patient -> {
            String email = patient.getEmail();
            String contact = patient.getContact();
            String subject = "Appointment Confirmation - " + doctor.getUsername();
            String text = "Dear " + patient.getName() + ",\n\nYour appointment with Dr. " + doctor.getUsername() +
                    " is scheduled for " + request.getAppointmentDate() + " at " + request.getAppointmentTime()
                    + ".\n\nThank you,\nHMS";
            if (email != null && email.contains("@")) {
                notificationService.sendEmail(email, subject, text);
            }
            if (contact != null && contact.matches("[0-9+]{8,}")) {
                notificationService.sendSms(contact, text);
            }
        });
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Appointment> updateAppointment(Long id, AppointmentRequest request) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setPatientId(request.getPatientId());
            appointment.setDoctorId(request.getDoctorId());
            appointment.setAppointmentDate(request.getAppointmentDate());
            appointment.setAppointmentTime(request.getAppointmentTime());
            appointment.setReason(request.getReason());
            appointment.setNotes(request.getNotes());
            appointment.setStatus(request.getStatus() != null ? request.getStatus() : appointment.getStatus());
            return appointmentRepository.save(appointment);
        });
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public Page<Appointment> getAppointmentsPaged(Pageable pageable, Long doctorId, Long patientId) {
        if (doctorId != null && patientId != null) {
            return appointmentRepository.findByDoctorIdAndPatientId(doctorId, patientId, pageable);
        } else if (doctorId != null) {
            return appointmentRepository.findByDoctorId(doctorId, pageable);
        } else if (patientId != null) {
            return appointmentRepository.findByPatientId(patientId, pageable);
        } else {
            return appointmentRepository.findAll(pageable);
        }
    }

    @Override
    public List<Appointment> getTodayAppointments() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDateTime start = today.atStartOfDay();
        java.time.LocalDateTime end = today.plusDays(1).atStartOfDay().minusNanos(1);
        return appointmentRepository.findByAppointmentTimeBetween(start, end);
    }

    @Override
    @Transactional
    public Appointment bookPublicAppointment(com.task.hms.opd.dto.PublicAppointmentRequestDTO request) {
        // 1. Check if patient exists by email or phone
        Optional<Patient> existingPatient = patientRepository.findByEmail(request.getPatientEmail());
        if (existingPatient.isEmpty()) {
            existingPatient = patientRepository.findByContact(request.getPatientPhone());
        }

        Patient patient;
        if (existingPatient.isPresent()) {
            patient = existingPatient.get();
        } else {
            // 2. Create new patient if not exists
            patient = new Patient();
            patient.setName(request.getPatientName());
            patient.setEmail(request.getPatientEmail());
            patient.setContact(request.getPatientPhone());
            patient.setAge(0); // Default, to be updated later
            patient.setGender("Other"); // Default
            patient.setAddress("Online Booking"); // Default
            patient.setPatientId("P" + System.currentTimeMillis()); // Simple ID generation
            patient = patientRepository.save(patient);
        }

        // 3. Book Appointment
        Appointment appointment = new Appointment();
        appointment.setPatientId(patient.getId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(Appointment.Status.SCHEDULED);
        // appointment.setSource(Appointment.AppointmentSource.ONLINE); // Assuming
        // setter exists or field is public

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        appointment.setDoctorName(doctor.getUsername());

        // Send confirmation ( reusing existing logic )
        String email = patient.getEmail();
        String subject = "Appointment Confirmation - " + doctor.getUsername();
        String text = "Dear " + patient.getName() + ",\n\nYour appointment with Dr. " + doctor.getUsername() +
                " is scheduled for " + request.getAppointmentDate() + " at " + request.getAppointmentTime()
                + ".\n\nThank you,\nHMS";
        if (email != null && email.contains("@")) {
            notificationService.sendEmail(email, subject, text);
        }

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<java.time.LocalTime> getAvailableSlots(Long doctorId, java.time.LocalDate date) {
        java.time.LocalTime start = java.time.LocalTime.of(9, 0);
        java.time.LocalTime end = java.time.LocalTime.of(17, 0);
        List<java.time.LocalTime> allSlots = new java.util.ArrayList<>();

        while (start.isBefore(end)) {
            allSlots.add(start);
            start = start.plusMinutes(30);
        }

        List<Appointment> booked = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
        List<java.time.LocalTime> bookedTimes = booked.stream()
                .map(Appointment::getAppointmentTime)
                .collect(java.util.stream.Collectors.toList());

        allSlots.removeAll(bookedTimes);
        return allSlots;
    }
}
