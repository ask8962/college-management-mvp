package com.collegeos.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@collegeos.com}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.name:College OS}")
    private String appName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "Verify your email - " + appName;
        String verifyUrl = frontendUrl + "/verify-email?token=" + token;

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #171717; }
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

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Reset your password - " + appName;
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #171717; }
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
                            <strong>⚠️ Security Notice:</strong> This link will expire in 15 minutes. If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
                        </div>
                        <div class="footer">
                            <p>© 2024 %s. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(appName, resetUrl, appName);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("✅ Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
            throw new EmailException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public static class EmailException extends RuntimeException {
        public EmailException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
