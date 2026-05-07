package com.example.webapp.repository;

import com.example.webapp.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByAttemptId(Long attemptId);
}