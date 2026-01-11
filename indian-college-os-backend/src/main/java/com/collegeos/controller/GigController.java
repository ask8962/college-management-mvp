package com.collegeos.controller;

import com.collegeos.dto.request.GigRequest;
import com.collegeos.dto.response.GigResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.GigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gigs")
@RequiredArgsConstructor
public class GigController {

    private final GigService gigService;
    private final com.collegeos.repository.UserRepository userRepository; // Direct repo dependency for finding user ID

    @PostMapping
    public ResponseEntity<GigResponse> create(
            @Valid @RequestBody GigRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(gigService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<GigResponse>> getAll() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(gigService.getOpen(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<GigResponse>> getAllIncludingClosed() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(gigService.getAll(userId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GigResponse>> getByCategory(
            @PathVariable String category) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(gigService.getByCategory(category, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GigResponse>> getMyGigs() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(gigService.getMyGigs(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<GigResponse> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(gigService.updateStatus(id, body.get("status"), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        String userId = getCurrentUserId();
        gigService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    private String getCurrentUserId() {
        String email = (String) org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
