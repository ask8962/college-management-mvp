package com.collegeos.controller;

import com.collegeos.model.User;
import com.collegeos.repository.UserRepository;
import com.collegeos.service.TwoFactorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/2fa")
@RequiredArgsConstructor
public class TwoFactorController {

        private final TwoFactorService twoFactorService;
        private final UserRepository userRepository;

        @PostMapping("/setup")
        public ResponseEntity<?> setupTwoFactor(HttpServletRequest request) {
                User user = getUserFromRequest(request);
                if (user == null)
                        return ResponseEntity.status(401).build();

                String secret = twoFactorService.generateSecret();
                user.setTwoFactorSecret(secret);
                userRepository.save(user);

                String qrCodeUri = twoFactorService.generateQrCodeDataUri(secret, user.getEmail());

                return ResponseEntity.ok(Map.of(
                                "secret", secret,
                                "qrCodeUri", qrCodeUri));
        }

        @PostMapping("/verify")
        public ResponseEntity<?> verifyTwoFactor(@RequestBody Map<String, String> body, HttpServletRequest request) {
                User user = getUserFromRequest(request);
                if (user == null)
                        return ResponseEntity.status(401).build();

                String code = body.get("code");
                if (code == null)
                        return ResponseEntity.badRequest().body("Code required");

                boolean isValid = twoFactorService.verifyCode(user.getTwoFactorSecret(), code);

                if (isValid) {
                        user.setTwoFactorEnabled(true);
                        userRepository.save(user);
                        return ResponseEntity.ok(Map.of("message", "2FA enabled successfully"));
                } else {
                        return ResponseEntity.badRequest().body("Invalid code");
                }
        }

        @PostMapping("/disable")
        public ResponseEntity<?> disableTwoFactor(HttpServletRequest request) {
                User user = getUserFromRequest(request);
                if (user == null)
                        return ResponseEntity.status(401).build();

                user.setTwoFactorEnabled(false);
                user.setTwoFactorSecret(null);
                userRepository.save(user);

                return ResponseEntity.ok(Map.of("message", "2FA disabled successfully"));
        }

        private User getUserFromRequest(HttpServletRequest request) {
                // Since JwtAuthenticationFilter already set the SecurityContext,
                // we can rely on it to get the currently authenticated user
                String email = null;
                if (request.getUserPrincipal() != null) {
                        email = request.getUserPrincipal().getName();
                }

                if (email != null) {
                        return userRepository.findByEmail(email).orElse(null);
                }
                return null;
        }
}
