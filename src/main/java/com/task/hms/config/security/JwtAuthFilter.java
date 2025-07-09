package com.task.hms.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("[JwtAuthFilter] Incoming request: " + request.getMethod() + " " + request.getRequestURI() + " | Content-Type: " + request.getContentType());
        String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (userDetails != null) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("[JwtAuthFilter] Authenticated user: " + username + " | Authorities: " + userDetails.getAuthorities());
            }
        } else {
            System.out.println("[JwtAuthFilter] No authentication set for user: " + username);
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        AntPathMatcher pathMatcher = new AntPathMatcher();
        if (pathMatcher.match("/api/billing/**", path) || pathMatcher.match("/api/insurance/**", path)) {
            return true;
        }
        String[] excludedPaths = {
            "/api/auth/**",
            "/api/users/register",
            "/swagger-ui.html",
            "/swagger-ui/",
            "/swagger-ui/**",
            "/v3/api-docs",
            "/v3/api-docs/",
            "/v3/api-docs/**",
            "/api-docs",
            "/api-docs/",
            "/api-docs/**",
            "/actuator/health",
            "/actuator/**",
            "/uploads/patient-photos/**"
        };
        // Allow GET for OPD endpoints, but require JWT for POST/PUT/DELETE
        if (pathMatcher.match("/api/opd/**", path) && "GET".equalsIgnoreCase(method)) {
            return true;
        }
        for (String pattern : excludedPaths) {
            if (pathMatcher.match(pattern, path)) {
                return true;
            }
        }
        return false;
    }
}
