package com.task.hms.pharmacy.scheduled;

import com.task.hms.notification.NotificationService;
import com.task.hms.pharmacy.model.MedicineBatch;
import com.task.hms.pharmacy.service.MedicineBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class PharmacyBatchAlertScheduler {
    @Autowired
    private MedicineBatchService batchService;
    @Autowired
    private NotificationService notificationService;

    // TODO: Replace with real admin/pharmacist emails
    private static final String ALERT_EMAIL = "your_admin_email@gmail.com";

    @Scheduled(cron = "0 0 8 * * *") // Every day at 8 AM
    public void checkAndNotifyBatchAlerts() {
        List<MedicineBatch> lowStock = batchService.getLowStockBatches(10);
        List<MedicineBatch> expiring = batchService.getExpiringBatches(30);

        if (!lowStock.isEmpty()) {
            StringBuilder sb = new StringBuilder("Low Stock Alert:\n");
            for (MedicineBatch batch : lowStock) {
                sb.append("Medicine: ").append(batch.getMedicine().getName())
                  .append(", Batch: ").append(batch.getBatchNumber())
                  .append(", Qty: ").append(batch.getQuantity()).append("\n");
            }
            notificationService.sendEmail(ALERT_EMAIL, "Pharmacy Low Stock Alert", sb.toString());
        }

        if (!expiring.isEmpty()) {
            StringBuilder sb = new StringBuilder("Expiring Soon Alert:\n");
            for (MedicineBatch batch : expiring) {
                sb.append("Medicine: ").append(batch.getMedicine().getName())
                  .append(", Batch: ").append(batch.getBatchNumber())
                  .append(", Expiry: ").append(batch.getExpiryDate()).append("\n");
            }
            notificationService.sendEmail(ALERT_EMAIL, "Pharmacy Expiry Alert", sb.toString());
        }
    }
}
