package com.collegeos.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/health").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Admin only endpoints
                        // POST /attendance is now allowed for students (self-tracking)
                        .requestMatchers(HttpMethod.POST, "/notices/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/exams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/placements/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/attendance/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/notices/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/exams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/placements/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")

                        // Chat endpoints - PATCH for broadcast toggle (Admin only)
                        .requestMatchers(HttpMethod.PATCH, "/chat/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/chat/rooms").hasRole("ADMIN")

                        // Authenticated endpoints
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
