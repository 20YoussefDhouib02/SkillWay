package com.example.roadmap.repository;

import com.example.roadmap.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    Optional<Roadmap> findByName(String name);
    List<Roadmap> findAll(); 
}
