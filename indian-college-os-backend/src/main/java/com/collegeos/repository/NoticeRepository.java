package com.collegeos.repository;

import com.collegeos.model.Notice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {
    List<Notice> findAllByOrderByCreatedAtDesc();
}
