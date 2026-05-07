package com.example.webapp.repository;

import com.example.webapp.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByTestId(Long testId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Section s WHERE s.test.id = ?1")
    void deleteByTestId(Long testId);
}