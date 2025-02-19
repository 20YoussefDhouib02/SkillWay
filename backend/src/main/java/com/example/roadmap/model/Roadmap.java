package com.example.roadmap.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Roadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) // Ensure the name is unique and not null
    private String name;

    // Other fields (e.g., description, createdAt, etc.)
}