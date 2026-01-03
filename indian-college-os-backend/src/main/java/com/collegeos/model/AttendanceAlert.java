package com.collegeos.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "attendance_alerts")
public class AttendanceAlert {
    @Id
    private String id;

    private String subject;
    private String location; // e.g., "Room 301", "Lab 2"
    private String message; // e.g., "Prof just started roll call!"
    private String postedBy; // User ID
    private String postedByName;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt; // Auto-expire after X minutes
    private boolean active;
}
