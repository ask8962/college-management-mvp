package com.collegeos.config;

import com.collegeos.repository.UserRepository;
import com.collegeos.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String email = jwtUtil.extractEmail(jwt);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    if (jwtUtil.isTokenValid(jwt, email)) {
                        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

                        var authToken = new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                });
            }
        } catch (ExpiredJwtException e) {
            // Expected case - token expired, user needs to re-login
            log.debug("JWT token expired for request to {}", request.getRequestURI());
        } catch (SignatureException e) {
            // Security concern - someone is sending forged tokens
            log.warn("Invalid JWT signature detected from IP: {} for URI: {}",
                    request.getRemoteAddr(), request.getRequestURI());
        } catch (MalformedJwtException e) {
            // Security concern - malformed token
            log.warn("Malformed JWT token from IP: {} for URI: {}",
                    request.getRemoteAddr(), request.getRequestURI());
        } catch (Exception e) {
            // Unexpected error - log for debugging
            log.error("JWT authentication error: {} for URI: {}",
                    e.getMessage(), request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }
}
