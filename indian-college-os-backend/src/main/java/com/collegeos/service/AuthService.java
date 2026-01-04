package com.collegeos.service;

import com.collegeos.dto.request.LoginRequest;
import com.collegeos.dto.request.RegisterRequest;
import com.collegeos.dto.response.AuthResponse;
import com.collegeos.model.User;
import com.collegeos.repository.UserRepository;
import com.collegeos.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TwoFactorService twoFactorService;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already registered");
        }

        if (userRepository.existsByStudentId(request.getStudentId())) {
            throw new AuthException("Student ID already registered");
        }

        User.Role role = User.Role.STUDENT;
        if (request.getEmail().equalsIgnoreCase("ganukalp70@gmail.com")) {
            role = User.Role.ADMIN;
        }

        User user = User.builder()
                .name(request.getName())
                .studentId(request.getStudentId())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .twoFactorEnabled(false)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getStudentId());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .studentId(user.getStudentId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .twoFactorRequired(false)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }

        // Auto-promote to ADMIN if matching email
        if (user.getEmail().equalsIgnoreCase("ganukalp70@gmail.com") && user.getRole() != User.Role.ADMIN) {
            user.setRole(User.Role.ADMIN);
            user = userRepository.save(user);
        }

        // Check if 2FA is enabled
        if (user.isTwoFactorEnabled()) {
            if (request.getTwoFactorCode() != null && !request.getTwoFactorCode().isEmpty()) {
                boolean isValid = twoFactorService.verifyCode(user.getTwoFactorSecret(), request.getTwoFactorCode());
                if (!isValid) {
                    throw new AuthException("Invalid 2FA code");
                }
            } else {
                return AuthResponse.builder()
                        .twoFactorRequired(true)
                        .email(user.getEmail())
                        .build();
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getStudentId());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .studentId(user.getStudentId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .twoFactorRequired(false)
                .build();
    }

    /**
     * Custom exception for authentication errors
     */
    public static class AuthException extends RuntimeException {
        public AuthException(String message) {
            super(message);
        }
    }
}
