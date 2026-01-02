package com.collegeos.repository;

import com.collegeos.model.Exam;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamRepository extends MongoRepository<Exam, String> {
    List<Exam> findByExamDateAfterOrderByExamDateAsc(LocalDate date);

    List<Exam> findAllByOrderByExamDateAsc();
}
