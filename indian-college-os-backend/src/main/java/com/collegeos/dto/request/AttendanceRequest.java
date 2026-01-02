package com.collegeos.dto.request;

import com.collegeos.model.Attendance;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceRequest {
    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Status is required")
    private Attendance.Status status;
}
