package com.task.hms.ipd.controller;

import com.task.hms.ipd.dto.IPDAdmissionResponseDTO;
import com.task.hms.ipd.service.IPDAdmissionService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/ipd/admissions")
public class DischargeSummaryController {
    @Autowired
    private IPDAdmissionService admissionService;

    @GetMapping("/{id}/discharge-summary-pdf")
    public ResponseEntity<byte[]> exportDischargeSummary(@PathVariable Long id) {
        IPDAdmissionResponseDTO admission = admissionService.getAdmission(id);
        if (admission == null || admission.getDischargeDate() == null) return ResponseEntity.notFound().build();
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Discharge Summary"));
            document.add(new Paragraph("Admission ID: " + admission.getId()));
            document.add(new Paragraph("Patient ID: " + admission.getPatientId()));
            document.add(new Paragraph("Doctor ID: " + admission.getDoctorId()));
            document.add(new Paragraph("Ward ID: " + admission.getWardId()));
            document.add(new Paragraph("Bed ID: " + admission.getBedId()));
            document.add(new Paragraph("Admission Date: " + admission.getAdmissionDate()));
            document.add(new Paragraph("Discharge Date: " + admission.getDischargeDate()));
            document.add(new Paragraph("Attendant: " + admission.getAttendantName() + " (" + admission.getAttendantContact() + ")"));
            document.add(new Paragraph("Insurance: " + admission.getInsuranceDetails()));
            document.add(new Paragraph("Initial Deposit: " + admission.getInitialDeposit()));
            document.add(new Paragraph("Status: " + admission.getStatus()));
            document.add(new Paragraph("Notes: " + admission.getAdmissionNotes()));
            document.close();
            byte[] pdfBytes = baos.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=discharge-summary-" + admission.getId() + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
