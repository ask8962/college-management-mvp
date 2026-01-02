package com.collegeos.controller;

import com.collegeos.dto.request.AttendanceRequest;
import com.collegeos.dto.response.AttendanceResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<AttendanceResponse> create(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String studentId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(attendanceService.getByStudentId(studentId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttendanceResponse>> getAll() {
        return ResponseEntity.ok(attendanceService.getAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getByStudentId(studentId));
    }
}
