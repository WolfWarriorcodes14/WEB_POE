package com.example.webapp.controller;

import com.example.webapp.model.Result;
import com.example.webapp.model.User;
import com.example.webapp.repository.UserRepository;
import com.example.webapp.repository.TestRepository;
import com.example.webapp.repository.ResultRepository;
import com.example.webapp.service.TestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private TestService testService;   // <-- add this

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        long totalStudents = userRepository.countByRole("STUDENT");
        long totalTests = testRepository.count();
        long totalAttempts = resultRepository.count();
        data.put("students", totalStudents);
        data.put("tests", totalTests);
        data.put("attempts", totalAttempts);
        return data;
    }

    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findAll()
                .stream()
                .filter(u -> "STUDENT".equals(u.getRole()))
                .toList();
    }

    @GetMapping("/results/test/{testId}")
    public List<Result> getResultsByTest(@PathVariable Long testId) {
        return resultRepository.findByTestId(testId);
    }

    // 🗑️ DELETE TEST
    @DeleteMapping("/tests/{id}")
    public ResponseEntity<?> deleteTest(@PathVariable Long id) {
        try {
            testService.deleteTest(id);
            return ResponseEntity.ok(Map.of("message", "Test deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}