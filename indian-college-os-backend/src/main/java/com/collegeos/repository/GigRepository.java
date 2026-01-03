package com.collegeos.repository;

import com.collegeos.model.Gig;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GigRepository extends MongoRepository<Gig, String> {
    List<Gig> findByStatusOrderByCreatedAtDesc(Gig.Status status);

    List<Gig> findByPostedByOrderByCreatedAtDesc(String postedBy);

    List<Gig> findByCategoryAndStatusOrderByCreatedAtDesc(String category, Gig.Status status);

    List<Gig> findAllByOrderByCreatedAtDesc();
}
