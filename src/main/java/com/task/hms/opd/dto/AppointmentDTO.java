package com.task.hms.opd.dto;

import com.task.hms.opd.model.Appointment;
import com.task.hms.opd.model.Patient;
import com.task.hms.user.model.User;

public class AppointmentDTO {
    private Long id;
    private Patient patient;
    private User doctor;
    private String appointmentDate;
    private String appointmentTime;
    private String reason;
    private String notes;
    private String status;
    private String doctorName;

    public AppointmentDTO(Appointment appointment, Patient patient, User doctor) {
        this.id = appointment.getId();
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointment.getAppointmentDate().toString();
        this.appointmentTime = appointment.getAppointmentTime().toString();
        this.reason = appointment.getReason();
        this.notes = appointment.getNotes();
        this.status = appointment.getStatus().name();
        this.doctorName = appointment.getDoctorName();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
