package com.collegeos.controller;

import com.collegeos.dto.request.AttendanceAlertRequest;
import com.collegeos.dto.response.AttendanceAlertResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.AttendanceAlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
public class AttendanceAlertController {

    private final AttendanceAlertService alertService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<AttendanceAlertResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AttendanceAlertRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(alertService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceAlertResponse>> getActiveAlerts() {
        return ResponseEntity.ok(alertService.getActiveAlerts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        alertService.deactivateAlert(id, userId);
        return ResponseEntity.noContent().build();
    }
}
