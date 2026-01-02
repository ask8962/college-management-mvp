package com.collegeos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class ExamResponse {
    private String id;
    private String subject;
    private LocalDate examDate;
    private LocalDate deadline;
    private String description;
}
