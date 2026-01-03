package com.collegeos.repository;

import com.collegeos.model.ProfessorReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;

import java.util.List;
import java.util.Optional;

public interface ProfessorReviewRepository extends MongoRepository<ProfessorReview, String> {
    List<ProfessorReview> findByProfessorNameContainingIgnoreCaseOrderByCreatedAtDesc(String name);

    List<ProfessorReview> findByDepartmentOrderByCreatedAtDesc(String department);

    List<ProfessorReview> findAllByOrderByCreatedAtDesc();

    Optional<ProfessorReview> findByProfessorNameIgnoreCaseAndPostedBy(String professorName, String postedBy);

    // Get distinct professor names for search
    @Aggregation(pipeline = {
            "{ '$group': { '_id': '$professorName' } }",
            "{ '$project': { '_id': 0, 'name': '$_id' } }"
    })
    List<String> findDistinctProfessorNames();
}
