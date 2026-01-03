package com.collegeos.controller;

import com.collegeos.dto.response.ActivityResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ActivityResponse> getActivity(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(activityService.getActivity(userId));
    }

    @PostMapping("/checkin")
    public ResponseEntity<ActivityResponse> checkIn(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(activityService.checkIn(userId));
    }
}
