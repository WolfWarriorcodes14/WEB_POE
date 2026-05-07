package com.example.webapp.repository;

import com.example.webapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Question q WHERE q.section.id = ?1")
    void deleteBySectionId(Long sectionId);
}