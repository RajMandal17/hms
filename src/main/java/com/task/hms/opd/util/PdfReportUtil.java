package com.task.hms.opd.util;

import com.task.hms.opd.dto.ConsultationResponseDTO;
import com.task.hms.opd.dto.MedicineDTO;
import com.task.hms.opd.model.Patient;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfReportUtil {
    public static byte[] generatePatientHistoryPdf(Patient patient, List<ConsultationResponseDTO> consultations, double billAmount) throws Exception {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        document.add(new Paragraph("Patient History Report", titleFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Patient Name: " + patient.getName(), normalFont));
        document.add(new Paragraph("Gender: " + patient.getGender(), normalFont));
        document.add(new Paragraph("Phone: " + patient.getContact(), normalFont));
        document.add(new Paragraph("Address: " + patient.getAddress(), normalFont));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{2, 2, 2, 2, 2});
        String[] headers = {"Date", "Doctor", "Diagnosis", "Prescription", "Notes"};
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
        for (ConsultationResponseDTO c : consultations) {
            table.addCell(new Phrase(c.getConsultationTime() != null ? c.getConsultationTime().toString() : "", normalFont));
            table.addCell(new Phrase(c.getDoctorName(), normalFont));
            table.addCell(new Phrase(c.getDiagnosis(), normalFont));
            StringBuilder meds = new StringBuilder();
            if (c.getMedicines() != null) {
                for (MedicineDTO m : c.getMedicines()) {
                    meds.append(m.getName()).append(" (").append(m.getDosage()).append(")\n");
                }
            }
            table.addCell(new Phrase(meds.toString(), normalFont));
            table.addCell(new Phrase(c.getNotes(), normalFont));
        }
        document.add(table);
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Total Bill: Rs. " + billAmount, headerFont));
        document.close();
        return out.toByteArray();
    }
}
