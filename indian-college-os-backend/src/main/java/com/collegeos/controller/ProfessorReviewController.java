package com.collegeos.controller;

import com.collegeos.dto.request.ProfessorReviewRequest;
import com.collegeos.dto.response.ProfessorReviewResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.ProfessorReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ProfessorReviewController {

    private final ProfessorReviewService reviewService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ProfessorReviewResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ProfessorReviewRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(reviewService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<ProfessorReviewResponse>> getAll() {
        return ResponseEntity.ok(reviewService.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProfessorReviewResponse>> search(@RequestParam String name) {
        return ResponseEntity.ok(reviewService.searchByName(name));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<ProfessorReviewResponse>> getByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(reviewService.getByDepartment(department));
    }

    @GetMapping("/stats")
    public ResponseEntity<List<Map<String, Object>>> getProfessorStats() {
        return ResponseEntity.ok(reviewService.getProfessorStats());
    }
}
