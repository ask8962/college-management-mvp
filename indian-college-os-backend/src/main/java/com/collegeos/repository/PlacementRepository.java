package com.collegeos.repository;

import com.collegeos.model.Placement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlacementRepository extends MongoRepository<Placement, String> {
    List<Placement> findByDeadlineAfterOrderByDeadlineAsc(LocalDate date);

    List<Placement> findAllByOrderByDeadlineAsc();
}
