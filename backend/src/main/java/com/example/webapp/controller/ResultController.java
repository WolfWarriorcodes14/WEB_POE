package com.example.webapp.controller;

import com.example.webapp.dto.ResultDTO;
import com.example.webapp.model.Result;
import com.example.webapp.model.User;
import com.example.webapp.service.ResultService;
import com.example.webapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public Result submitResult(@RequestBody Result result) {
        if (result.getUserId() == null || result.getTestId() == null) {
            throw new RuntimeException("UserId or TestId missing");
        }
        return resultService.saveResult(result);
    }

    @GetMapping("/exists")
    public boolean checkAlreadyAttempted(@RequestParam Long userId, @RequestParam Long testId) {
        return resultService.isAlreadyAttempted(userId, testId);
    }

    @GetMapping("/student/{userId}")
    public List<Result> getCompletedTests(@PathVariable Long userId) {
        return resultService.getResultsByUser(userId);
    }

    @GetMapping("/get")
    public Result getResult(@RequestParam Long userId, @RequestParam Long testId) {
        return resultService.getResult(userId, testId);
    }

    @GetMapping("/{id}")
    public ResultDTO getResultById(@PathVariable Long id) {
        Result result = resultService.getResultById(id);
        if (result == null) throw new RuntimeException("Result not found");
        ResultDTO dto = new ResultDTO(result);
        userRepository.findById(result.getUserId()).ifPresent(user -> dto.setUserEmail(user.getEmail()));
        return dto;
    }

    @GetMapping("/count")
    public long getTotalAttempts() {
        return resultService.countAllResults();
    }

    @GetMapping("/test/{testId}")
    public List<ResultDTO> getResultsByTest(@PathVariable Long testId) {
        List<Result> results = resultService.getResultsByTest(testId);
        return results.stream().map(result -> {
            ResultDTO dto = new ResultDTO(result);
            userRepository.findById(result.getUserId()).ifPresent(user -> dto.setUserEmail(user.getEmail()));
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/admin/active-students")
    public List<User> getActiveStudents() {
        return resultService.getActiveStudents();
    }

    @PutMapping("/grade/{resultId}")
    public ResponseEntity<?> gradeResult(@PathVariable Long resultId,
                                         @RequestBody Map<Long, Double> gradedAnswers) {
        try {
            Result updated = resultService.gradeResult(resultId, gradedAnswers);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}