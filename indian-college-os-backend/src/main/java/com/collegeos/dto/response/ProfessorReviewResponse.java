package com.collegeos.dto.response;

import com.collegeos.model.ProfessorReview;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorReviewResponse {
    private String id;
    private String professorName;
    private String department;
    private String subject;
    private Integer chillFactor;
    private Integer attendanceStrictness;
    private Integer marksGenerosity;
    private Integer teachingQuality;
    private Double overallRating;
    private String review;
    private LocalDateTime createdAt;

    public static ProfessorReviewResponse fromReview(ProfessorReview review) {
        double overall = (review.getChillFactor() + review.getMarksGenerosity() + review.getTeachingQuality()
                + (6 - review.getAttendanceStrictness())) / 4.0; // Inverse strictness

        return ProfessorReviewResponse.builder()
                .id(review.getId())
                .professorName(review.getProfessorName())
                .department(review.getDepartment())
                .subject(review.getSubject())
                .chillFactor(review.getChillFactor())
                .attendanceStrictness(review.getAttendanceStrictness())
                .marksGenerosity(review.getMarksGenerosity())
                .teachingQuality(review.getTeachingQuality())
                .overallRating(Math.round(overall * 10.0) / 10.0)
                .review(review.getReview())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
