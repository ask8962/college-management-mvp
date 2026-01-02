package com.collegeos.controller;

import com.collegeos.dto.request.ExamRequest;
import com.collegeos.dto.response.ExamResponse;
import com.collegeos.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping
    public ResponseEntity<ExamResponse> create(@Valid @RequestBody ExamRequest request) {
        return ResponseEntity.ok(examService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ExamResponse>> getAll() {
        return ResponseEntity.ok(examService.getAll());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ExamResponse>> getUpcoming() {
        return ResponseEntity.ok(examService.getUpcoming());
    }
}
