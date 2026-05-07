package com.example.webapp.service;

import com.example.webapp.model.Test;
import com.example.webapp.repository.TestRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepo;

    @PersistenceContext
    private EntityManager entityManager;

    public Test createTest(Test test) {
        return testRepo.save(test);
    }

    public List<Test> getAllTests() {
        return testRepo.findAll();
    }

    public Test getTest(Long id) {
        return testRepo.findById(id).orElse(null);
    }

    public long getTotalTests() {
        return testRepo.count();
    }

    @Transactional
    public void deleteTest(Long testId) {
        // 1. Delete results (they reference attempts or test directly)
        entityManager.createNativeQuery("DELETE FROM results WHERE test_id = ?1")
                .setParameter(1, testId)
                .executeUpdate();

        // 2. Delete attempts
        entityManager.createNativeQuery("DELETE FROM attempts WHERE test_id = ?1")
                .setParameter(1, testId)
                .executeUpdate();

        // 3. Delete questions (they belong to sections of this test)
        entityManager.createNativeQuery("DELETE FROM questions WHERE section_id IN (SELECT id FROM sections WHERE test_id = ?1)")
                .setParameter(1, testId)
                .executeUpdate();

        // 4. Delete sections
        entityManager.createNativeQuery("DELETE FROM sections WHERE test_id = ?1")
                .setParameter(1, testId)
                .executeUpdate();

        // 5. Finally delete the test
        entityManager.createNativeQuery("DELETE FROM tests WHERE id = ?1")
                .setParameter(1, testId)
                .executeUpdate();
    }
}