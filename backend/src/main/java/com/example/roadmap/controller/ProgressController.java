package com.example.roadmap.controller;

import com.example.roadmap.model.Progress;
import com.example.roadmap.service.ProgressService;
import com.example.roadmap.model.User;

import jakarta.servlet.http.HttpSession;
import com.example.roadmap.repository.ProgressRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200",allowCredentials = "true") 
@RestController
@RequestMapping("/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;
    private final ProgressRepository progressRepository;

    // Constructor-based dependency injection
    public ProgressController(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @GetMapping
    public List<Progress> getAllProgress() {
        return progressService.getAllProgress();
    }

    @GetMapping("/{id}")
    public Optional<Progress> getProgressById(@PathVariable Long id) {
        return progressService.getProgressById(id);
    }

    @PostMapping
    public Progress createProgress(@RequestBody Progress progress) {
        return progressService.saveProgress(progress);
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable Long id) {
        progressService.deleteProgress(id);
    }
    @GetMapping("/load/{roadmapId}")
    public ResponseEntity<?> getProgress(@PathVariable Long roadmapId, HttpSession session) {
        // Retrieve the logged-in user from the session
        User loggedInUser = (User) session.getAttribute("user");
    
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found in session");
        }
    
        Long userId = loggedInUser.getId();
        
        // Check if a progress entry exists
        Optional<Progress> progress = progressRepository.findByUserIdAndRoadmapId(userId, roadmapId);
    
        if (progress.isPresent()) {
            return ResponseEntity.ok(progress.get());
        } else {
            return ResponseEntity.ok("False"); // Return "False" if no progress entry exists
        }
    }
}
