package com.task.hms.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SmsServiceImpl implements SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsServiceImpl.class);

    @Value("${sms.gateway.api-key:dummy}")
    private String apiKey;

    @Override
    public void sendSms(String to, String message) {
        // TODO: Integrate with real SMS gateway (e.g., Twilio, Nexmo)
        logger.info("[SMS] To: {} | Message: {} (API Key: {})", to, message, apiKey);
        // Example: Use RestTemplate or HTTP client to call SMS provider API
    }
}
