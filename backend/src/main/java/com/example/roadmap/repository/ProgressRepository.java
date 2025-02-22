package com.example.roadmap.repository;

import com.example.roadmap.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserIdAndRoadmapId(Long userId, Long roadmapId);
}
