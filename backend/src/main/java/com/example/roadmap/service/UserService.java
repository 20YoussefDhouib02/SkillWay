package com.example.roadmap.service;

import com.example.roadmap.model.User;
import com.example.roadmap.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        // Check if the email is already in use
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
    
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already in use. Please use a different email.");
        }
    
        // Print the user details before saving
        System.out.println("Registering user: " + user);
    
        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Save the user to the database
        User savedUser = userRepository.save(user);
        System.out.println("User registered successfully: " + savedUser);
        return savedUser;
    }
    public User login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; 
            }
        }
        throw new RuntimeException("Invalid email or password.");
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Verify the old password matches the current password
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Old password is incorrect.");
            }
            // Encode the new password and update the user
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found.");
        }
    }
    public void updateUser(User user) {
        userRepository.save(user); // Update the user in the database
    }
    
}
