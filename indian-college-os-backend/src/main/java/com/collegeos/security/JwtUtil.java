package com.collegeos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Token expiry times
    private static final long PASSWORD_RESET_EXPIRATION = 15 * 60 * 1000; // 15 minutes
    private static final long EMAIL_VERIFICATION_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userId, String email, String role, String studentId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        claims.put("studentId", studentId);
        claims.put("type", "auth");
        return createToken(claims, email, expiration);
    }

    public String generatePasswordResetToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "password_reset");
        return createToken(claims, email, PASSWORD_RESET_EXPIRATION);
    }

    public String generateEmailVerificationToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "email_verification");
        return createToken(claims, email, EMAIL_VERIFICATION_EXPIRATION);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationMs) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    public String extractStudentId(String token) {
        return extractClaim(token, claims -> claims.get("studentId", String.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token, String email) {
        try {
            final String extractedEmail = extractEmail(token);
            return (extractedEmail.equals(email) && !isTokenExpired(token));
        } catch (ExpiredJwtException e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    public boolean isPasswordResetToken(String token) {
        try {
            String type = extractTokenType(token);
            return "password_reset".equals(type) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isEmailVerificationToken(String token) {
        try {
            String type = extractTokenType(token);
            return "email_verification".equals(type) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
