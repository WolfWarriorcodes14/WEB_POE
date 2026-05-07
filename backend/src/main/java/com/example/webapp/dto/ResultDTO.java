package com.example.webapp.dto;

import com.example.webapp.model.Result;

public class ResultDTO {
    private Long id;
    private Long userId;
    private String userEmail;          // NEW
    private Long testId;
    private Long attemptId;
    private Integer totalTime;
    private Double memoryScore;
    private String answersJson;
    private String submittedAt;

    public ResultDTO(Result result) {
        this.id = result.getId();
        this.userId = result.getUserId();
        this.testId = result.getTestId();
        this.attemptId = result.getAttemptId();
        this.totalTime = result.getTotalTime();
        this.memoryScore = result.getMemoryScore();
        this.answersJson = result.getAnswersJson();
        this.submittedAt = result.getSubmittedAt() != null ? result.getSubmittedAt().toString() : null;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    public Integer getTotalTime() { return totalTime; }
    public void setTotalTime(Integer totalTime) { this.totalTime = totalTime; }
    public Double getMemoryScore() { return memoryScore; }
    public void setMemoryScore(Double memoryScore) { this.memoryScore = memoryScore; }
    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String answersJson) { this.answersJson = answersJson; }
    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
}