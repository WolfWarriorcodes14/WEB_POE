package com.example.webapp.repository;

import com.example.webapp.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Answer a WHERE a.attempt.testId = ?1")
    void deleteByTestId(Long testId);
}