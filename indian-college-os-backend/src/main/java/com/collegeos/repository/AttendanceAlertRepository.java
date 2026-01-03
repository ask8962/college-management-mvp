package com.collegeos.repository;

import com.collegeos.model.AttendanceAlert;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceAlertRepository extends MongoRepository<AttendanceAlert, String> {
    List<AttendanceAlert> findByActiveIsTrueAndExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime now);

    List<AttendanceAlert> findAllByOrderByCreatedAtDesc();
}
