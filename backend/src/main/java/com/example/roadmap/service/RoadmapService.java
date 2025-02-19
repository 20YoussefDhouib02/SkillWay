package com.example.roadmap.service;

import com.example.roadmap.model.FavoriteRoadmap;
import com.example.roadmap.model.Roadmap;
import com.example.roadmap.model.User;
import com.example.roadmap.repository.FavoriteRoadmapRepository;
import com.example.roadmap.repository.RoadmapRepository;
import com.example.roadmap.repository.UserRepository;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final FavoriteRoadmapRepository favoriteRoadmapRepository;

    public RoadmapService(RoadmapRepository roadmapRepository, UserRepository userRepository, FavoriteRoadmapRepository favoriteRoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
        this.favoriteRoadmapRepository = favoriteRoadmapRepository;
    }

    // Look up a roadmap record by id
    public Optional<Roadmap> getRoadmapById(Long id) {
        return roadmapRepository.findById(id);
    }

    // Look up a roadmap record by name
    public Optional<Roadmap> getRoadmapByName(String name) {
        return roadmapRepository.findByName(name);
    }

    /**
     * Loads the JSON file located at: roadmap/{name}/{name}.json
     */
    public Optional<String> loadRoadmapJson(String name) {
        try {
            ClassPathResource resource = new ClassPathResource("roadmap/" + name + "/" + name + ".json");
            String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            return Optional.of(content);
        } catch (IOException e) {
            // Log error if needed
            return Optional.empty();
        }
    }

    /**
     * Loads the Markdown file located at: roadmap/{name}/{name}.md
     */
    public Optional<String> loadRoadmapMarkdown(String name) {
        try {
            ClassPathResource resource = new ClassPathResource("roadmap/" + name + "/" + name + ".md");
            String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            return Optional.of(content);
        } catch (IOException e) {
            // Log error if needed
            return Optional.empty();
        }
    }
    public boolean addFavorite(Long userId, Long roadmapId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Roadmap> roadmapOpt = roadmapRepository.findById(roadmapId);

        if (userOpt.isPresent() && roadmapOpt.isPresent()) {
            User user = userOpt.get();
            Roadmap roadmap = roadmapOpt.get();

            if (!favoriteRoadmapRepository.existsByUserAndRoadmap(user, roadmap)) {
                FavoriteRoadmap favorite = new FavoriteRoadmap();
                favorite.setUser(user);
                favorite.setRoadmap(roadmap);
                favoriteRoadmapRepository.save(favorite);
                return true;
            }
        }
        return false;
    }

    // Remove roadmap from user's favorites
    public boolean removeFavorite(Long userId, Long roadmapId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Roadmap> roadmapOpt = roadmapRepository.findById(roadmapId);

        if (userOpt.isPresent() && roadmapOpt.isPresent()) {
            User user = userOpt.get();
            Roadmap roadmap = roadmapOpt.get();

            Optional<FavoriteRoadmap> favoriteOpt = favoriteRoadmapRepository.findByUserAndRoadmap(user, roadmap);
            if (favoriteOpt.isPresent()) {
                favoriteRoadmapRepository.delete(favoriteOpt.get());
                return true;
            }
        }
        return false;
    }

    // Check if a roadmap is favorited by a user
    public boolean isFavorite(Long userId, Long roadmapId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Roadmap> roadmapOpt = roadmapRepository.findById(roadmapId);

        return userOpt.isPresent() && roadmapOpt.isPresent() &&
               favoriteRoadmapRepository.existsByUserAndRoadmap(userOpt.get(), roadmapOpt.get());
    }
    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findAll(); // Returns all roadmaps
    }

    public List<Roadmap> getFavoriteRoadmapsByUser(Long userId) {
        return favoriteRoadmapRepository.findByUserId(userId)
                .stream()
                .map(FavoriteRoadmap::getRoadmap)
                .collect(Collectors.toList());
    }
}
