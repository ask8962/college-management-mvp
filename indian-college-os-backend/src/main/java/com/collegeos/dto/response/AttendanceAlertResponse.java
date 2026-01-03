package com.collegeos.dto.response;

import com.collegeos.model.AttendanceAlert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceAlertResponse {
    private String id;
    private String subject;
    private String location;
    private String message;
    private String postedByName;
    private LocalDateTime createdAt;
    private long minutesAgo;
    private long minutesLeft;
    private boolean isUrgent;

    public static AttendanceAlertResponse fromAlert(AttendanceAlert alert) {
        LocalDateTime now = LocalDateTime.now();
        long minutesAgo = ChronoUnit.MINUTES.between(alert.getCreatedAt(), now);
        long minutesLeft = ChronoUnit.MINUTES.between(now, alert.getExpiresAt());

        return AttendanceAlertResponse.builder()
                .id(alert.getId())
                .subject(alert.getSubject())
                .location(alert.getLocation())
                .message(alert.getMessage())
                .postedByName(alert.getPostedByName())
                .createdAt(alert.getCreatedAt())
                .minutesAgo(minutesAgo)
                .minutesLeft(Math.max(0, minutesLeft))
                .isUrgent(minutesAgo < 5) // Less than 5 mins old = urgent
                .build();
    }
}
