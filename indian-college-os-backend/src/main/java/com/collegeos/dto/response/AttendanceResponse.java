package com.collegeos.dto.response;

import com.collegeos.model.Attendance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class AttendanceResponse {
    private String id;
    private String studentId;
    private String subject;
    private LocalDate date;
    private Attendance.Status status;
}
