package com.collegeos.controller;

import com.collegeos.dto.request.TwoFactorVerifyRequest;
import com.collegeos.dto.response.TwoFactorSetupResponse;
import com.collegeos.model.User;
import com.collegeos.repository.UserRepository;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.TwoFactorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/2fa")
@RequiredArgsConstructor
public class TwoFactorController {

    private final TwoFactorService twoFactorService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * Get 2FA status for current user
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getStatus(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(Map.of("enabled", user.isTwoFactorEnabled()));
    }

    /**
     * Initialize 2FA setup - generates secret and QR code
     */
    @PostMapping("/setup")
    public ResponseEntity<TwoFactorSetupResponse> setup(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new secret
        String secret = twoFactorService.generateSecret();

        // Generate QR code
        String qrCodeDataUri = twoFactorService.generateQrCodeDataUri(secret, user.getEmail());

        // Save secret (not enabled yet until verified)
        user.setTwoFactorSecret(secret);
        userRepository.save(user);

        return ResponseEntity.ok(TwoFactorSetupResponse.builder()
                .secret(secret)
                .qrCodeDataUri(qrCodeDataUri)
                .build());
    }

    /**
     * Verify 2FA code and enable 2FA
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody TwoFactorVerifyRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTwoFactorSecret() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "2FA not set up. Please call /setup first."));
        }

        boolean isValid = twoFactorService.verifyCode(user.getTwoFactorSecret(), request.getCode());

        if (isValid) {
            user.setTwoFactorEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "2FA enabled successfully!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid code. Please try again."));
        }
    }

    /**
     * Disable 2FA
     */
    @PostMapping("/disable")
    public ResponseEntity<Map<String, Object>> disable(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody TwoFactorVerifyRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isTwoFactorEnabled()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "2FA is not enabled."));
        }

        boolean isValid = twoFactorService.verifyCode(user.getTwoFactorSecret(), request.getCode());

        if (isValid) {
            user.setTwoFactorEnabled(false);
            user.setTwoFactorSecret(null);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "2FA disabled successfully."));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid code. Please try again."));
        }
    }
}
