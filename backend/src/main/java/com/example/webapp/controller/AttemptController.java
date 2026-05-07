package com.example.webapp.controller;

import com.example.webapp.model.Attempt;
import com.example.webapp.repository.AttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin(origins = "http://localhost:3000")
public class AttemptController {

    @Autowired
    private AttemptRepository attemptRepository;

    @PostMapping("/start")
    public Attempt startAttempt(@RequestParam Long userId, @RequestParam Long testId) {
        Attempt attempt = new Attempt();
        attempt.setUserId(userId);
        attempt.setTestId(testId);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setStatus("IN_PROGRESS");
        return attemptRepository.save(attempt);
    }
}