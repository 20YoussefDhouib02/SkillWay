package com.example.roadmap.controller;

import com.example.roadmap.model.Roadmap;
import com.example.roadmap.model.User;
import com.example.roadmap.repository.RoadmapRepository;
import com.example.roadmap.service.RoadmapService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200") 
@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final RoadmapRepository roadmapRepository;


    public RoadmapController(RoadmapService roadmapService,RoadmapRepository roadmapRepository) {
        this.roadmapService = roadmapService;
        this.roadmapRepository = roadmapRepository;
    }

    /**
     * GET endpoint to retrieve the roadmap files by id.
     * Example: GET http://localhost:8080/api/roadmap/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoadmapById(@PathVariable Long id) {
        Optional<Roadmap> roadmapOptional = roadmapService.getRoadmapById(id);
        if (roadmapOptional.isPresent()) {
            String name = roadmapOptional.get().getName();
            return getFilesResponse(name);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Roadmap not found for id: " + id);
        }
    }

    /**
     * GET endpoint to retrieve the roadmap files by name.
     * Example: GET http://localhost:8080/api/roadmap/name/alpha
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getRoadmapByName(@PathVariable String name) {
        Optional<Roadmap> roadmapOptional = roadmapService.getRoadmapByName(name);
        if (roadmapOptional.isPresent()) {
            return getFilesResponse(name);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Roadmap not found for name: " + name);
        }
    }


    /**
     * Helper method to load both JSON and Markdown files using the roadmap name.
     */
    private ResponseEntity<?> getFilesResponse(String name) {
        Optional<String> jsonContent = roadmapService.loadRoadmapJson(name);
        Optional<String> markdownContent = roadmapService.loadRoadmapMarkdown(name);

        if (jsonContent.isPresent() && markdownContent.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("json", jsonContent.get());
            response.put("markdown", markdownContent.get());
            return ResponseEntity.ok(response);
        } else if (jsonContent.isEmpty() && markdownContent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Neither JSON nor Markdown files were found for roadmap: " + name);
        } else if (jsonContent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("JSON file not found for roadmap: " + name);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Markdown file not found for roadmap: " + name);
        }
    }
    @GetMapping("/all")
    public ResponseEntity<List<Roadmap>> getAllRoadmaps() {
        List<Roadmap> roadmaps = roadmapService.getAllRoadmaps();
        return ResponseEntity.ok(roadmaps); // Return all roadmaps as JSON
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<Roadmap> getRoadmapByIdd(@PathVariable Long id) {
        Optional<Roadmap> roadmap = roadmapRepository.findById(id);
        return roadmap.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Add a roadmap to favorites using session-stored userId.
     */
    
}
