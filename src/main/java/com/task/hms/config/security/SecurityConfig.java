package com.task.hms.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**", "/api/users/register", "/swagger-ui.html", "/swagger-ui/", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/", "/v3/api-docs/**", "/api-docs", "/api-docs/", "/api-docs/**", "/actuator/health", "/actuator/**").permitAll()
                // Allow unauthenticated access to patient photos
                .requestMatchers("/uploads/patient-photos/**").permitAll()
                // Allow GET for all OPD endpoints
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/opd/**").permitAll()
                // Allow GET for doctor, ward, and bed dropdowns for all users (for debugging)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/user/doctors", "/api/ipd/wards", "/api/ipd/beds").permitAll()
                // TEMP: Allow GET for pharmacy and billing alerts for debugging
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/pharmacy/batches/low-stock", "/api/pharmacy/batches/expiring", "/api/billing/bills/pending").permitAll()
                // Restrict IPD vitals endpoints to NURSE or ADMIN role
                .requestMatchers("/api/ipd/vitals/**").hasAnyRole("NURSE", "ADMIN")
                // Restrict IPD doctor rounds endpoints to DOCTOR or ADMIN role
                .requestMatchers("/api/ipd/rounds/**").hasAnyRole("DOCTOR", "ADMIN")
                // Allow POST for adding medicines to ADMIN, PHARMACIST, and NURSE roles
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/pharmacy/medicines").hasAnyRole("ADMIN", "PHARMACIST", "NURSE")
                // Allow POST for adding batches to ADMIN, PHARMACIST, and NURSE roles
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/pharmacy/batches").hasAnyRole("ADMIN", "PHARMACIST", "NURSE")
                // Allow PUT for updating batches to ADMIN, PHARMACIST, and NURSE roles
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/pharmacy/batches/**").hasAnyRole("ADMIN", "PHARMACIST", "NURSE")
                // Allow POST for recording payments to ADMIN, ACCOUNTANT, and CASHIER roles
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/payments/record").hasAnyRole("ADMIN", "ACCOUNTANT", "CASHIER")
                // Restrict updating admissions to ADMIN, DOCTOR, BILLING roles
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/ipd/admissions/**").hasAnyRole("ADMIN", "DOCTOR", "BILLING")
                // Allow all requests to /api/insurance/** endpoints for development/testing
                .requestMatchers("/api/insurance/**").permitAll()
                // Allow all requests to /api/billing/** endpoints for development/testing
                .requestMatchers("/api/billing/**").permitAll()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}
