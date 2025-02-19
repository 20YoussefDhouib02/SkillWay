package com.example.roadmap.controller;

import com.example.roadmap.dto.SkillRequest;
import com.example.roadmap.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200") 
@RestController
@RequestMapping("/api/skill")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    /**
     * POST endpoint that receives a JSON payload with "name" and "id" and returns the file content.
     *
     * Example Request:
     * POST http://localhost:8080/api/skill/load
     *
     * Request Body:
     * {
     *   "name": "alpha",
     *   "id": "XYZ"
     * }
     */
    @PostMapping("/load")
    public ResponseEntity<?> loadSkillFile(@RequestBody SkillRequest request) {
        String name = request.getName();
        String id = request.getId();

        Optional<String> fileContent = skillService.loadSkillFile(name, id);
        if (fileContent.isPresent()) {
            return ResponseEntity.ok(fileContent.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("File not found for skill: " + name + " with id: " + id);
        }
    }
}
