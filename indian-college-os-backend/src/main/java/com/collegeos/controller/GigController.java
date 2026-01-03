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
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<GigResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody GigRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(gigService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<GigResponse>> getAll(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(gigService.getOpen(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<GigResponse>> getAllIncludingClosed(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(gigService.getAll(userId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GigResponse>> getByCategory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String category) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(gigService.getByCategory(category, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GigResponse>> getMyGigs(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(gigService.getMyGigs(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<GigResponse> updateStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(gigService.updateStatus(id, body.get("status"), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        gigService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
