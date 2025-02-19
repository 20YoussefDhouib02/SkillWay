package com.example.roadmap.controller;

import com.example.roadmap.model.Roadmap;
import com.example.roadmap.model.User;
import com.example.roadmap.service.RoadmapService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200",allowCredentials = "true") 
@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {

    private final RoadmapService roadmapService;

    public FavoriteController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    /**
     * Add a roadmap to the user's favorites.
     */
    @PostMapping("/add")
    public ResponseEntity<String> addFavorite(@RequestBody Map<String, Long> payload, HttpSession session) {
        User user = (User) session.getAttribute("user"); // Get userId from session
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not authenticated");
        }
        Long userId = (Long) user.getId();
        System.out.println("Session UserId: " + userId); // Debugging

        Long roadmapId = payload.get("roadmapId");
        System.out.println("roadmapId: " + roadmapId); // Debugging


        

        boolean success = roadmapService.addFavorite(userId, roadmapId);
        return success
                ? ResponseEntity.ok("Roadmap added to favorites.")
                : ResponseEntity.badRequest().body("Failed to add roadmap to favorites.");
    }

    /**
     * Remove a roadmap from the user's favorites.
     */
    @PostMapping("/remove")
    public ResponseEntity<String> removeFavorite(@RequestBody Map<String, Long> payload, HttpSession session) {
        User user = (User) session.getAttribute("user"); // Get userId from session
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not authenticated");
        }
        Long userId = (Long) user.getId();
        Long roadmapId = payload.get("roadmapId");

        

        boolean success = roadmapService.removeFavorite(userId, roadmapId);
        return success
                ? ResponseEntity.ok("Roadmap removed from favorites.")
                : ResponseEntity.badRequest().body("Failed to remove roadmap from favorites.");
    }

    /**
     * Check if a roadmap is favorited by the user.
     */
    @PostMapping("/check")
    public ResponseEntity<Boolean> isFavorite(@RequestBody Map<String, Long> payload, HttpSession session) {
        //System.out.println("roadmapId:");
        System.out.println("Session ID: " + session.getId());
        User user = (User) session.getAttribute("user"); // Get userId from session
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(false);
        }
        Long userId = (Long) user.getId();
        Long roadmapId = payload.get("roadmapId");
        System.out.println("roadmapId: " + roadmapId);

        

        boolean isFavorite = roadmapService.isFavorite(userId, roadmapId);
        return ResponseEntity.ok(isFavorite);
    }
    @GetMapping("/me")
    public ResponseEntity<?> getUserFavoriteRoadmaps(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in.");
        }

        List<Roadmap> favoriteRoadmaps = roadmapService.getFavoriteRoadmapsByUser(user.getId());
        return ResponseEntity.ok(favoriteRoadmaps);
    }
}
