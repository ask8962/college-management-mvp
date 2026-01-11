package com.collegeos.controller;

import com.collegeos.model.Subject;
import com.collegeos.model.User;
import com.collegeos.service.SubjectService;
import com.collegeos.service.UserService;
import com.collegeos.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private UserService userService; // To get User from token

    @Autowired
    private JwtUtil jwtUtil;

    // Helper to extract user from token (simplified for MVP)
    private User getUser(String token) {
        String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<Map<String, Object>> getMySubjects(@RequestHeader("Authorization") String token) {
        User user = getUser(token);
        List<Subject> subjects = subjectService.getMySubjects(user);

        // Enrich with stats
        return subjects.stream().map(s -> {
            Map<String, Object> stats = subjectService.getBunkStats(s);
            stats.put("id", s.getId());
            stats.put("name", s.getName());
            stats.put("targetAttendance", s.getTargetAttendance());
            return stats;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Subject createSubject(@RequestHeader("Authorization") String token, @RequestBody Subject subject) {
        User user = getUser(token);
        return subjectService.createSubject(user, subject);
    }

    @PostMapping("/{id}/attendance")
    public Subject markAttendance(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return subjectService.markAttendance(id, payload.get("status"));
    }

    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable String id) {
        subjectService.deleteSubject(id);
    }
}
