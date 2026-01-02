package com.collegeos.repository;

import com.collegeos.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);

    List<Attendance> findByStudentIdAndSubject(String studentId, String subject);
}
