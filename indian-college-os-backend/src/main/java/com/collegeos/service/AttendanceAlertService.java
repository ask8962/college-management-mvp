package com.collegeos.service;

import com.collegeos.dto.request.AttendanceAlertRequest;
import com.collegeos.dto.response.AttendanceAlertResponse;
import com.collegeos.model.AttendanceAlert;
import com.collegeos.model.User;
import com.collegeos.repository.AttendanceAlertRepository;
import com.collegeos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceAlertService {

    private final AttendanceAlertRepository alertRepository;
    private final UserRepository userRepository;

    private static final int ALERT_DURATION_MINUTES = 15; // Alerts expire after 15 mins

    public AttendanceAlertResponse create(AttendanceAlertRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AttendanceAlert alert = AttendanceAlert.builder()
                .subject(request.getSubject())
                .location(request.getLocation())
                .message(request.getMessage() != null ? request.getMessage() : "Attendance is being taken!")
                .postedBy(userId)
                .postedByName(user.getName())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(ALERT_DURATION_MINUTES))
                .active(true)
                .build();

        alert = alertRepository.save(alert);
        return AttendanceAlertResponse.fromAlert(alert);
    }

    public List<AttendanceAlertResponse> getActiveAlerts() {
        return alertRepository.findByActiveIsTrueAndExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime.now())
                .stream()
                .map(AttendanceAlertResponse::fromAlert)
                .collect(Collectors.toList());
    }

    public void deactivateAlert(String alertId, String userId) {
        AttendanceAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getPostedBy().equals(userId)) {
            throw new RuntimeException("You can only deactivate your own alerts");
        }

        alert.setActive(false);
        alertRepository.save(alert);
    }
}
