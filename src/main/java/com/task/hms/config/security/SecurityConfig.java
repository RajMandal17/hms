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
            .cors(withDefaults()) // Enable CORS at the security filter chain
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**", "/api/users/register", "/swagger-ui/**", "/v3/api-docs/**", "/actuator/health").permitAll()
                // Allow unauthenticated access to patient photos
                .requestMatchers("/uploads/patient-photos/**").permitAll()
                // Allow POST /api/opd/patients for any authenticated user
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/opd/patients").authenticated()
                // Allow POST /api/appointments for any authenticated user
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/appointments").authenticated()
                // Allow GET for all OPD endpoints
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/opd/**").permitAll()
                // Allow GET for doctor, ward, and bed dropdowns for all users (for debugging)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/user/doctors", "/api/ipd/wards", "/api/ipd/beds").permitAll()
                // Restrict IPD vitals endpoints to NURSE role
                .requestMatchers("/api/ipd/vitals/**").hasRole("NURSE")
                // Restrict IPD doctor rounds endpoints to DOCTOR role
                .requestMatchers("/api/ipd/rounds/**").hasRole("DOCTOR")
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
