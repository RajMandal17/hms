package com.task.hms.opd.scheduled;

import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.model.Patient;
import com.task.hms.opd.repository.AppointmentRepository;
import com.task.hms.opd.repository.PatientRepository;
import com.task.hms.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class AppointmentReminderScheduler {
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private NotificationService notificationService;

    // Runs every hour
    @Scheduled(cron = "0 0 * * * *")
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24h = now.plusHours(24);
        List<Appointment> upcoming = appointmentRepository.findAll().stream()
            .filter(a -> !a.isReminderSent() && a.getStatus() == Appointment.Status.SCHEDULED)
            .filter(a -> {
                LocalDateTime apptDateTime = LocalDateTime.of(a.getAppointmentDate(), a.getAppointmentTime());
                return apptDateTime.isAfter(now) && apptDateTime.isBefore(next24h);
            })
            .toList();
        for (Appointment appt : upcoming) {
            patientRepository.findById(appt.getPatientId()).ifPresent(patient -> {
                String email = patient.getEmail();
                String contact = patient.getContact();
                String subject = "Appointment Reminder";
                String text = "Dear " + patient.getName() + ",\n\nThis is a reminder for your appointment with Dr. " + appt.getDoctorName() +
                        " on " + appt.getAppointmentDate() + " at " + appt.getAppointmentTime() + ".\n\nThank you,\nHMS";
                if (email != null && email.contains("@")) {
                    notificationService.sendEmail(email, subject, text);
                }
                if (contact != null && contact.matches("[0-9+]{8,}")) {
                    notificationService.sendSms(contact, text);
                }
            });
            appt.setReminderSent(true);
            appointmentRepository.save(appt);
        }
    }
}
