package com.example.roadmap.repository;

import com.example.roadmap.model.FavoriteRoadmap;
import com.example.roadmap.model.User;
import com.example.roadmap.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRoadmapRepository extends JpaRepository<FavoriteRoadmap, Long> {
    boolean existsByUserAndRoadmap(User user, Roadmap roadmap);
    Optional<FavoriteRoadmap> findByUserAndRoadmap(User user, Roadmap roadmap);
    List<FavoriteRoadmap> findByUserId(Long userId);
}
