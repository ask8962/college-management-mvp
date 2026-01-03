package com.collegeos.controller;

import com.collegeos.dto.request.UpdateStudentIdRequest;
import com.collegeos.dto.response.UserResponse;
import com.collegeos.model.User;
import com.collegeos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllStudents() {
        List<UserResponse> students = userRepository.findByRole(User.Role.STUDENT)
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(toUserResponse(user));
    }

    @PutMapping("/{id}/student-id")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateStudentId(
            @PathVariable String id,
            @RequestBody UpdateStudentIdRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if new studentId is already taken by another user
        if (request.getStudentId() != null && !request.getStudentId().equals(user.getStudentId())) {
            if (userRepository.existsByStudentId(request.getStudentId())) {
                throw new RuntimeException("Student ID already in use");
            }
        }

        user.setStudentId(request.getStudentId());
        user = userRepository.save(user);
        return ResponseEntity.ok(toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .studentId(user.getStudentId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
