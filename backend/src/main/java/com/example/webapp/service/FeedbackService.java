package com.example.webapp.service;

import com.example.webapp.model.Feedback;
import com.example.webapp.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback saveFeedback(Feedback feedback) {
        feedback.setSubmittedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    public Feedback getFeedbackByAttempt(Long attemptId) {
        return feedbackRepository.findByAttemptId(attemptId).orElse(null);
    }
}