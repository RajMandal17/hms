package com.task.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointAutoConfiguration;

@Configuration
public class ActuatorConfig {
    // Default config is usually enough for most setups.
    // You can customize endpoint exposure here if needed.
}
