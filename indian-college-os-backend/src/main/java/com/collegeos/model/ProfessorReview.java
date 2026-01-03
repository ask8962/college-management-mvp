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
@Document(collection = "professor_reviews")
public class ProfessorReview {
    @Id
    private String id;

    private String professorName;
    private String department;
    private String subject; // Optional - which subject they taught

    // Ratings (1-5 scale)
    private Integer chillFactor; // How relaxed are they
    private Integer attendanceStrictness; // How strict about attendance
    private Integer marksGenerosity; // How generous with marks
    private Integer teachingQuality; // How good at teaching

    private String review; // Anonymous text review
    private String postedBy; // User ID (kept for preventing duplicates, not shown)
    private LocalDateTime createdAt;
}
