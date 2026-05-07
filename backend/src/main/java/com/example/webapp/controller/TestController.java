package com.example.webapp.controller;

import com.example.webapp.model.Test;
import com.example.webapp.model.Section;
import com.example.webapp.model.Question;
import com.example.webapp.repository.TestRepository;
import com.example.webapp.dto.TestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private TestRepository testRepository;

    @GetMapping
    public List<TestDTO> getAllTests() {
        List<Test> tests = testRepository.findAll();
        logger.info("Fetched {} tests", tests.size());
        return tests.stream()
                .map(TestDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TestDTO getTestById(@PathVariable Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        return new TestDTO(test);
    }

    @PostMapping("/create")
    public Test createTest(@RequestBody Test test) {
        logger.info("Received test: {}", test.getTitle());
        if (test.getSections() != null) {
            int sectionOrder = 1;
            for (Section section : test.getSections()) {
                section.setSectionOrder(sectionOrder++);
                section.setTest(test);
                if (section.getQuestions() != null) {
                    int questionOrder = 1;
                    for (Question q : section.getQuestions()) {
                        q.setSection(section);
                        q.setQuestionOrder(questionOrder++);
                    }
                }
            }
        }
        try {
            Test saved = testRepository.save(test);
            logger.info("Saved test with id: {}", saved.getId());
            return saved;
        } catch (Exception e) {
            logger.error("Failed to save test", e);
            throw new RuntimeException("Error saving test: " + e.getMessage(), e);
        }
    }
}