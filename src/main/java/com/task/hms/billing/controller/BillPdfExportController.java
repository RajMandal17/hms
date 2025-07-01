package com.task.hms.billing.controller;

import com.task.hms.billing.model.Bill;
import com.task.hms.billing.service.BillService;
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
@RequestMapping("/api/billing")
public class BillPdfExportController {
    @Autowired
    private BillService billService;

    @GetMapping("/bills/{id}/pdf")
    public ResponseEntity<byte[]> exportBillPdf(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        if (bill == null) return ResponseEntity.notFound().build();
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Hospital Bill"));
            document.add(new Paragraph("Bill ID: " + bill.getId()));
            document.add(new Paragraph("Patient ID: " + bill.getPatientId()));
            document.add(new Paragraph("Bill Type: " + bill.getBillType()));
            document.add(new Paragraph("Total Amount: " + bill.getTotalAmount()));
            document.add(new Paragraph("Paid Amount: " + bill.getPaidAmount()));
            document.add(new Paragraph("Status: " + bill.getStatus()));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Items:"));
            if (bill.getItems() != null) {
                for (var item : bill.getItems()) {
                    document.add(new Paragraph("- " + item.getDescription() + ": " + item.getAmount()));
                }
            }
            document.close();
            byte[] pdfBytes = baos.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bill-" + bill.getId() + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
