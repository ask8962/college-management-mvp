package com.collegeos.service;

import com.collegeos.dto.request.AttendanceRequest;
import com.collegeos.dto.response.AttendanceResponse;
import com.collegeos.model.Attendance;
import com.collegeos.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceResponse create(AttendanceRequest request) {
        Attendance attendance = Attendance.builder()
                .studentId(request.getStudentId())
                .subject(request.getSubject())
                .date(request.getDate())
                .status(request.getStatus())
                .build();

        attendance = attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    public List<AttendanceResponse> getByStudentId(String studentId) {
        return attendanceRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getAll() {
        return attendanceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudentId())
                .subject(attendance.getSubject())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .build();
    }
}
