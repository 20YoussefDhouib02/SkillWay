package com.example.roadmap.repository;

import com.example.roadmap.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    // Additional query methods can be added if needed.
}
