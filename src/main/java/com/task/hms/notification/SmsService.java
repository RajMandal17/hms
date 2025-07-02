package com.task.hms.notification;

public interface SmsService {
    void sendSms(String to, String message);
}
