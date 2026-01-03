package com.collegeos.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttendanceAlertRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Location is required")
    private String location;

    private String message;
}
