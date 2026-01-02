package com.collegeos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExamRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    private String description;
}
