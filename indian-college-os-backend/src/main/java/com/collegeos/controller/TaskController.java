package com.collegeos.controller;

import com.collegeos.dto.request.TaskRequest;
import com.collegeos.dto.response.TaskResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody TaskRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(taskService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Boolean completed) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);

        if (completed != null) {
            return ResponseEntity.ok(taskService.getByStatus(userId, completed));
        }
        return ResponseEntity.ok(taskService.getAll(userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(taskService.getStats(userId));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String taskId,
            @RequestBody TaskRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(taskService.update(taskId, request, userId));
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<TaskResponse> toggleComplete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String taskId) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(taskService.toggleComplete(taskId, userId));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String taskId) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        taskService.delete(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}
