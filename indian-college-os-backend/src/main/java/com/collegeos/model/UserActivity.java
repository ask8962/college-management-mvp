package com.collegeos.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_activity")
public class UserActivity {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private int currentStreak;
    private int longestStreak;
    private int totalActiveDays;
    private int totalXP;

    private LocalDate lastActiveDate;

    // Set of all active dates for heatmap
    @Builder.Default
    private Set<String> activeDates = new HashSet<>(); // Format: "2024-01-15"

    // Badges earned
    @Builder.Default
    private Set<String> badges = new HashSet<>();
}
