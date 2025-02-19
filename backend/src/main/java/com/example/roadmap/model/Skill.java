package com.example.roadmap.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "skills")
@Getter
@Setter
public class Skill {
    @Id
   
    private String id;

    // The name of the skill, which should match the folder name in resources.
    @Column(unique = true, nullable = false)
    private String name;
}
