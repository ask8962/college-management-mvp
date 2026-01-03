package com.collegeos.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProfessorReviewRequest {
    @NotBlank(message = "Professor name is required")
    private String professorName;

    @NotBlank(message = "Department is required")
    private String department;

    private String subject;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer chillFactor;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer attendanceStrictness;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer marksGenerosity;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer teachingQuality;

    private String review;
}
