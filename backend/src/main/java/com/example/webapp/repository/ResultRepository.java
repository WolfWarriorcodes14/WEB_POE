package com.example.webapp.repository;

import com.example.webapp.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    long countByTestId(Long testId);
    long countByUserId(Long userId);
    List<Result> findByUserId(Long userId);
    boolean existsByUserIdAndTestId(Long userId, Long testId);
    List<Result> findByUserIdAndTestId(Long userId, Long testId);
    List<Result> findAllByOrderBySubmittedAtDesc();
    List<Result> findByTestId(Long testId);

    @Query("SELECT DISTINCT r.userId FROM Result r")
    List<Long> findDistinctActiveUsers();
}