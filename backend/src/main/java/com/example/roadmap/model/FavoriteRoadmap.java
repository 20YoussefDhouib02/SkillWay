package com.example.roadmap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorite_roadmaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteRoadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "roadmap_id", nullable = false)
    private Roadmap roadmap;
}
