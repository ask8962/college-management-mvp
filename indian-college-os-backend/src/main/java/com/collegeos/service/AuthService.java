package com.collegeos.service;

import com.collegeos.dto.request.ForgotPasswordRequest;
import com.collegeos.dto.request.LoginRequest;
import com.collegeos.dto.request.RegisterRequest;
import com.collegeos.dto.request.ResetPasswordRequest;
import com.collegeos.dto.response.AuthResponse;
import com.collegeos.dto.response.MessageResponse;
import com.collegeos.model.User;
import com.collegeos.repository.UserRepository;
import com.collegeos.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TwoFactorService twoFactorService;
    private final EmailService emailService;

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

        // Generate email verification token
        String verificationToken = jwtUtil.generateEmailVerificationToken(request.getEmail());

        User user = User.builder()
                .name(request.getName())
                .studentId(request.getStudentId())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .twoFactorEnabled(false)
                .emailVerified(false)
                .emailVerificationToken(verificationToken)
                .emailVerificationExpiry(LocalDateTime.now().plusHours(24))
                .build();

        user = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationToken);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
            // Don't fail registration if email fails
        }

        // Return response indicating email verification is required
        return AuthResponse.builder()
                .id(user.getId())
                .studentId(user.getStudentId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .emailVerificationRequired(true)
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

        // Check if email is verified
        if (!user.isEmailVerified()) {
            return AuthResponse.builder()
                    .emailVerificationRequired(true)
                    .email(user.getEmail())
                    .build();
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
                .emailVerificationRequired(false)
                .build();
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        log.info("Password reset requested for: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Always return success to prevent email enumeration
        if (user == null) {
            log.warn("Password reset requested for non-existent email: {}", request.getEmail());
            return MessageResponse.success("If your email is registered, you will receive a password reset link.");
        }

        // Generate reset token
        String resetToken = jwtUtil.generatePasswordResetToken(user.getEmail());
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send reset email
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
        }

        return MessageResponse.success("If your email is registered, you will receive a password reset link.");
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {
        log.info("Processing password reset");

        // Validate token
        if (!jwtUtil.isPasswordResetToken(request.getToken())) {
            throw new AuthException("Invalid or expired reset token");
        }

        String email = jwtUtil.extractEmail(request.getToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Invalid reset token"));

        // Verify token matches stored token
        if (user.getPasswordResetToken() == null || !user.getPasswordResetToken().equals(request.getToken())) {
            throw new AuthException("Invalid or expired reset token");
        }

        // Check expiry
        if (user.getPasswordResetExpiry() == null || user.getPasswordResetExpiry().isBefore(LocalDateTime.now())) {
            throw new AuthException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);
        userRepository.save(user);

        log.info("Password reset successful for: {}", email);
        return MessageResponse
                .success("Password has been reset successfully. You can now login with your new password.");
    }

    public MessageResponse verifyEmail(String token) {
        log.info("Processing email verification");

        // Validate token
        if (!jwtUtil.isEmailVerificationToken(token)) {
            throw new AuthException("Invalid or expired verification token");
        }

        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Invalid verification token"));

        if (user.isEmailVerified()) {
            return MessageResponse.success("Email is already verified. You can login now.");
        }

        // Verify token matches stored token
        if (user.getEmailVerificationToken() == null || !user.getEmailVerificationToken().equals(token)) {
            throw new AuthException("Invalid or expired verification token");
        }

        // Check expiry
        if (user.getEmailVerificationExpiry() == null
                || user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new AuthException("Verification token has expired. Please request a new one.");
        }

        // Verify email
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpiry(null);
        userRepository.save(user);

        log.info("Email verified for: {}", email);
        return MessageResponse.success("Email verified successfully! You can now login.");
    }

    public MessageResponse resendVerification(String email) {
        log.info("Resending verification email to: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Email not found"));

        if (user.isEmailVerified()) {
            return MessageResponse.success("Email is already verified.");
        }

        // Generate new verification token
        String verificationToken = jwtUtil.generateEmailVerificationToken(email);
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(email, verificationToken);
            log.info("Verification email resent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
            throw new AuthException("Failed to send verification email. Please try again.");
        }

        return MessageResponse.success("Verification email sent. Please check your inbox.");
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
