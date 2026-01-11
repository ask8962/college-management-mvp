package com.collegeos.repository;

import com.collegeos.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByStudentId(String studentId);
}
