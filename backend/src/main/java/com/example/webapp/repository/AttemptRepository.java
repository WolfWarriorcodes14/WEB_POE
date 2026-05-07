package com.example.webapp.repository;

import com.example.webapp.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Attempt a WHERE a.testId = ?1")
    void deleteByTestId(Long testId);
}