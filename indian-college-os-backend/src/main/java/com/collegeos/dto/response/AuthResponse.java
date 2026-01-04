package com.collegeos.dto.response;

import com.collegeos.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String studentId;
    private String name;
    private String email;
    private User.Role role;

    // 2FA
    private boolean twoFactorRequired;

    // Email verification
    private boolean emailVerificationRequired;
}
