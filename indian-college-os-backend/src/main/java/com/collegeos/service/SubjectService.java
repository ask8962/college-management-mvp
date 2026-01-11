package com.collegeos.service;

import com.collegeos.model.Subject;
import com.collegeos.repository.SubjectRepository;
import com.collegeos.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getMySubjects(User user) {
        return subjectRepository.findByStudentId(user.getId());
    }

    public Subject createSubject(User user, Subject subject) {
        subject.setStudentId(user.getId());
        subject.setTotalClasses(0);
        subject.setAttendedClasses(0);
        return subjectRepository.save(subject);
    }

    public Subject markAttendance(String subjectId, String status) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if ("PRESENT".equalsIgnoreCase(status)) {
            subject.markPresent();
        } else if ("ABSENT".equalsIgnoreCase(status)) {
            subject.markAbsent();
        } else {
            // Cancelled, do nothing
        }
        return subjectRepository.save(subject);
    }

    public void deleteSubject(String subjectId) {
        subjectRepository.deleteById(subjectId);
    }

    // The Bunk-o-Meter Magic Logic 🎩
    public Map<String, Object> getBunkStats(Subject subject) {
        double current = subject.getCurrentPercentage();
        double target = subject.getTargetAttendance();
        Map<String, Object> stats = new HashMap<>();

        stats.put("currentPercentage", current);
        stats.put("totalClasses", subject.getTotalClasses());
        stats.put("attendedClasses", subject.getAttendedClasses());

        if (current >= target) {
            // How many can I bunk?
            // Formula: (attended) / (total + x) >= target/100
            // attended * 100 >= target * (total + x)
            // (attended * 100 / target) - total >= x

            int safeBunks = (int) Math
                    .floor((subject.getAttendedClasses() * 100.0 / target) - subject.getTotalClasses());
            stats.put("status", "SAFE");
            stats.put("message", "You can safely bunk " + safeBunks + " classes.");
            stats.put("safeBunks", safeBunks);
        } else {
            // How many must I attend?
            // Formula: (attended + x) / (total + x) >= target/100
            // 100(attended + x) >= target(total + x)
            // 100*attended + 100x >= target*total + target*x
            // 100x - target*x >= target*total - 100*attended
            // x(100 - target) >= target*total - 100*attended
            // x >= (target*total - 100*attended) / (100 - target)

            int needed = (int) Math.ceil(
                    (target * subject.getTotalClasses() - 100.0 * subject.getAttendedClasses()) / (100.0 - target));
            // Ensure non-negative (edge cases)
            needed = Math.max(needed, 0);

            stats.put("status", "DANGER");
            stats.put("message", "attend next " + needed + " classes to reach " + (int) target + "%.");
            stats.put("neededClasses", needed);
        }

        return stats;
    }
}
