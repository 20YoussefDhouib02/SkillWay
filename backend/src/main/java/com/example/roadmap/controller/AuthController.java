package com.example.roadmap.controller;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

import com.example.roadmap.dto.ChangePasswordRequest;
import com.example.roadmap.dto.LoginRequest;
import com.example.roadmap.model.User;
import com.example.roadmap.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200",allowCredentials = "true") 
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body("Email already in use. Please use a different email.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            // Attempt to authenticate the user
            User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

            // Log the session ID after successful login
            String sessionId = session.getId();
            session.setAttribute("user", user); // Store user data in session
            System.out.println("User authenticated successfully. Session ID: " + sessionId);
    
            // Log the user object for debugging
            System.out.println("Authenticated User: " + user);
    
            return ResponseEntity.ok().body(new SessionResponse(sessionId)); // Return a JSON object with the session ID
        } catch (RuntimeException e) {
            // Log the exception to aid in debugging
            System.err.println("Authentication failed for email: " + loginRequest.getEmail());
            e.printStackTrace();
    
            return ResponseEntity.badRequest().body("Invalid email or password.");
        }
    }
    
    public static class SessionResponse {
        private String JSESSIONID;

        public SessionResponse(String JSESSIONID) {
            this.JSESSIONID = JSESSIONID;
        }

        public String getJSESSIONID() {
            return JSESSIONID;
        }

        public void setJSESSIONID(String JSESSIONID) {
            this.JSESSIONID = JSESSIONID;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    
        return ResponseEntity.ok().body("Logged out successfully");
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                            HttpSession session) {
        User user = (User) session.getAttribute("user");
        Long userId = (Long) user.getId();
         
        //System.out.println("Session User ID: " + sessionDetails.toString());
        if (userId == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in.");
        }
        
        String oldPassword = request.getOldPassword();
        String newPassword = request.getNewPassword();
        System.out.println("password: " + oldPassword);


        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Both old password and new password are required.");
        }

        try {
            userService.changePassword(userId, oldPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getSessionData(HttpSession session) {
        // Log the session object
        System.out.println("Session ID: " + session.getId());
        
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session.");
        }
        
        // Log the user details
        System.out.println("User details: " + user);
    
        return ResponseEntity.ok(user); // Return user details stored in session
    }
    
private static final String UPLOAD_DIR = "uploads/";
@PostMapping("/upload-profile-pic")
public ResponseEntity<?> uploadProfilePic(@RequestParam("file") MultipartFile file, HttpSession session) {
    User user = (User) session.getAttribute("user");

    if (user == null) {
        return ResponseEntity.status(403).body("Unauthorized: Please log in.");
    }

    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("Please upload a valid file.");
    }

    try {
        // Create directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Sanitize filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid filename");
        }

        // Remove suspicious characters and sanitize
        String sanitizedFilename = originalFilename
            .replaceAll("\\s+", "_")          // Replace spaces with underscores
            .replaceAll("[^a-zA-Z0-9-_.]", "") // Remove special characters
            .replaceAll("-+", "-")            // Prevent multiple hyphens
            .replaceAll("_{2,}", "_")         // Prevent multiple underscores
            .replaceAll("\\.{2,}", ".");      // Prevent multiple dots

        // Add timestamp for uniqueness
        String timestamp = String.valueOf(System.currentTimeMillis());
        String fileName = user.getId() + "_" + timestamp + "_" + sanitizedFilename;

        // Save file to server
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Store image URL in user object
        String fileUrl = "http://localhost:8081/uploads/" + fileName;
        user.setProfilePicture(fileUrl);
        userService.updateUser(user);

        // Update session with new user info
        session.setAttribute("user", user);

        return ResponseEntity.ok("Profile picture uploaded successfully: " + fileUrl);
    } catch (IOException e) {
        return ResponseEntity.status(500).body("Error saving file: " + e.getMessage());
    }
}



    

}
