package com.collegeos.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.name:College OS}")
    private String appName;

    private boolean configured = false;
    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void init() {
        if (resendApiKey != null && !resendApiKey.isEmpty()) {
            configured = true;
            log.info("✅ Resend email service configured");
        } else {
            log.warn("⚠️ Email service not configured. Set RESEND_API_KEY environment variable to enable emails.");
        }
    }

    public boolean isConfigured() {
        return configured;
    }

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        if (!configured) {
            log.warn("⚠️ Email not configured. Skipping verification email to: {}", toEmail);
            return;
        }

        String verifyUrl = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify your email - " + appName;

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #171717; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
                        .button { display: inline-block; padding: 14px 28px; background-color: #1e40af; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; }
                        .footer { margin-top: 40px; text-align: center; color: #737373; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">%s</div>
                        </div>
                        <h2>Verify your email address</h2>
                        <p>Thank you for registering! Please click the button below to verify your email address.</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="%s" class="button">Verify Email</a>
                        </p>
                        <p>If you didn't create an account, you can safely ignore this email.</p>
                        <p>This link will expire in 24 hours.</p>
                        <div class="footer">
                            <p>© 2024 %s. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(appName, verifyUrl, appName);

        sendEmail(toEmail, subject, htmlContent);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        if (!configured) {
            log.warn("⚠️ Email not configured. Skipping password reset email to: {}", toEmail);
            return;
        }

        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset your password - " + appName;

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #171717; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
                        .button { display: inline-block; padding: 14px 28px; background-color: #1e40af; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; }
                        .footer { margin-top: 40px; text-align: center; color: #737373; font-size: 14px; }
                        .warning { background-color: #fef3c7; border: 1px solid #fde68a; padding: 12px; border-radius: 6px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">%s</div>
                        </div>
                        <h2>Reset your password</h2>
                        <p>We received a request to reset your password. Click the button below to create a new password.</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="%s" class="button">Reset Password</a>
                        </p>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong> This link will expire in 15 minutes.
                        </div>
                        <div class="footer">
                            <p>© 2024 %s. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(appName, resetUrl, appName);

        sendEmail(toEmail, subject, htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("from", fromEmail);
            body.put("to", to);
            body.put("subject", subject);
            body.put("html", htmlContent);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Email sent successfully to: {}", to);
            } else {
                log.error("❌ Failed to send email. Status: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
            // Don't throw - let the operation continue
        }
    }

    public static class EmailException extends RuntimeException {
        public EmailException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
