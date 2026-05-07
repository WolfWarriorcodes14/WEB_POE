package com.example.webapp.controller;

import com.example.webapp.model.Feedback;
import com.example.webapp.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        // Check if feedback already exists for this attempt
        if (feedbackRepository.findByAttemptId(feedback.getAttemptId()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Feedback already submitted"));
        }
        feedback.setSubmittedAt(java.time.LocalDateTime.now());
        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<?> getFeedbackByAttempt(@PathVariable Long attemptId) {
        return feedbackRepository.findByAttemptId(attemptId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}