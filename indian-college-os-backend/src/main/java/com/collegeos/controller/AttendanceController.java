package com.collegeos.controller;

import com.collegeos.dto.request.AttendanceRequest;
import com.collegeos.dto.response.AttendanceResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final JwtUtil jwtUtil;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendanceResponse> create(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendanceResponse> update(
            @PathVariable String id,
            @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String studentId = jwtUtil.extractStudentId(token);
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
