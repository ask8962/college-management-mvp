package com.collegeos.repository;

import com.collegeos.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserIdOrderByDueDateAsc(String userId);

    List<Task> findByUserIdAndCompletedOrderByDueDateAsc(String userId, boolean completed);

    List<Task> findByUserIdAndDueDateBeforeAndCompletedFalse(String userId, LocalDateTime date);

    long countByUserIdAndCompletedTrue(String userId);

    long countByUserIdAndCompletedFalse(String userId);
}
