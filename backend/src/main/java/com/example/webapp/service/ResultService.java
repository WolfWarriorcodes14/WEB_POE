package com.example.webapp.service;

import com.example.webapp.model.Question;
import com.example.webapp.model.Result;
import com.example.webapp.model.User;
import com.example.webapp.model.Test;
import com.example.webapp.model.Section;
import com.example.webapp.repository.QuestionRepository;
import com.example.webapp.repository.ResultRepository;
import com.example.webapp.repository.UserRepository;
import com.example.webapp.repository.TestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private static final Logger log = LoggerFactory.getLogger(ResultService.class);

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestRepository testRepository;

    public long countAllResults() {
        return resultRepository.count();
    }

    public long countByUserId(Long userId) {
        return resultRepository.countByUserId(userId);
    }

    public boolean isAlreadyAttempted(Long userId, Long testId) {
        return resultRepository.existsByUserIdAndTestId(userId, testId);
    }

    public List<Result> getResultsByUser(Long userId) {
        return resultRepository.findByUserId(userId);
    }

    public Result getResult(Long userId, Long testId) {
        List<Result> results = resultRepository.findByUserIdAndTestId(userId, testId);
        return results.isEmpty() ? null : results.get(0);
    }

    public Result getResultById(Long id) {
        return resultRepository.findById(id).orElse(null);
    }

    public List<Result> getResultsByTest(Long testId) {
        return resultRepository.findByTestId(testId);
    }

    // 🔥 SAVE RESULT WITH AUTO‑GRADING
    public Result saveResult(Result result) {
        List<Result> existing = resultRepository
                .findByUserIdAndTestId(result.getUserId(), result.getTestId());
        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Map<String, Object>> incomingAnswers =
                    mapper.readValue(result.getAnswersJson(), Map.class);

            // Fetch the test to get total possible points and question details
            Test test = testRepository.findById(result.getTestId())
                    .orElseThrow(() -> new RuntimeException("Test not found"));

            // Flatten all questions from sections
            List<Question> allQuestions = new ArrayList<>();
            for (Section section : test.getSections()) {
                allQuestions.addAll(section.getQuestions());
            }
            Map<Long, Question> questionMap = allQuestions.stream()
                    .collect(Collectors.toMap(Question::getId, q -> q));

            double totalPossiblePoints = 0;
            double totalEarnedPoints = 0;
            Map<String, Object> gradedAnswers = new HashMap<>();

            for (Map.Entry<String, Map<String, Object>> entry : incomingAnswers.entrySet()) {
                Long qid = Long.valueOf(entry.getKey());
                String userAnswer = (String) entry.getValue().get("answer");
                Object timeObj = entry.getValue().get("time");

                Question q = questionMap.get(qid);
                if (q == null) {
                    log.warn("Question {} not found, skipping", qid);
                    continue;
                }

                double pointsPossible = (q.getPoints() != null) ? q.getPoints() : 1.0;
                totalPossiblePoints += pointsPossible;
                double pointsEarned = 0;

                // Auto‑grade logic
                if (q.getCorrectAnswer() != null && !q.getCorrectAnswer().trim().isEmpty()) {
                    // For DRAW_IMAGE and IMAGE_DESCRIPTION, we skip auto‑grading (admin will review)
                    if ("DRAW_IMAGE".equals(q.getType()) || "IMAGE_DESCRIPTION".equals(q.getType())) {
                        // Give full points if user provided any answer (optional – change if needed)
                        if (userAnswer != null && !userAnswer.trim().isEmpty()) {
                            pointsEarned = pointsPossible;
                            totalEarnedPoints += pointsEarned;
                            log.debug("Drawing/Image description question {} – awarded {} points", qid, pointsEarned);
                        } else {
                            log.debug("Drawing/Image description question {} – no answer, 0 points", qid);
                        }
                    } else {
                        // Auto‑grade for MCQ, NUMERICAL, TEXT, FILL_BLANKS
                        if (isAnswerCorrect(userAnswer, q)) {
                            pointsEarned = pointsPossible;
                            totalEarnedPoints += pointsEarned;
                            log.debug("Question {} correct, earned {}", qid, pointsEarned);
                        } else {
                            log.debug("Question {} incorrect. User: '{}', Correct: '{}'",
                                    qid, userAnswer, q.getCorrectAnswer());
                        }
                    }
                } else {
                    // No correctAnswer defined – auto‑grading skipped, points remain 0
                    log.debug("No correctAnswer for question {}, auto‑grading skipped", qid);
                }

                // Store the graded answer with pointsEarned
                Map<String, Object> newAnswer = new HashMap<>();
                newAnswer.put("answer", userAnswer);
                newAnswer.put("time", timeObj != null ? timeObj : 0);
                newAnswer.put("pointsEarned", pointsEarned);
                gradedAnswers.put(entry.getKey(), newAnswer);
            }

            double percentage = (totalPossiblePoints > 0) ? (totalEarnedPoints / totalPossiblePoints) * 100 : 0;
            result.setMemoryScore(percentage);
            result.setSubmittedAt(java.time.LocalDateTime.now());
            result.setAnswersJson(mapper.writeValueAsString(gradedAnswers));
            log.info("Saved graded result: totalPoints={}, earnedPoints={}, percentage={}",
                    totalPossiblePoints, totalEarnedPoints, percentage);

        } catch (Exception e) {
            log.error("Error processing answers JSON", e);
            throw new RuntimeException("Error processing answers JSON", e);
        }

        return resultRepository.save(result);
    }

    private boolean isAnswerCorrect(String userAnswer, Question q) {
        if (userAnswer == null) return false;
        String correct = q.getCorrectAnswer().trim();
        String user = userAnswer.trim();

        // Handle different question types
        if ("MCQ".equals(q.getType()) || "MCQ_IMAGE".equals(q.getType())) {
            return user.equalsIgnoreCase(correct);
        } else if ("NUMERICAL".equals(q.getType())) {
            try {
                double userNum = Double.parseDouble(user);
                double correctNum = Double.parseDouble(correct);
                return Math.abs(userNum - correctNum) < 0.0001;
            } catch (NumberFormatException e) {
                return false;
            }
        } else if ("FILL_BLANKS".equals(q.getType())) {
            return user.equalsIgnoreCase(correct);
        } else if ("TEXT".equals(q.getType())) {
            return user.equalsIgnoreCase(correct);
        } else {
            return false;
        }
    }

    // 🔥 GRADE RESULT – ADMIN MANUAL OVERRIDE (optional)
    @Transactional
    public Result gradeResult(Long resultId, Map<Long, Double> gradedAnswers) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Map<String, Object>> answers =
                    mapper.readValue(result.getAnswersJson(), Map.class);

            Test test = testRepository.findById(result.getTestId())
                    .orElseThrow(() -> new RuntimeException("Test not found"));

            List<Question> allQuestions = new ArrayList<>();
            for (Section section : test.getSections()) {
                allQuestions.addAll(section.getQuestions());
            }
            Map<Long, Question> questionMap = allQuestions.stream()
                    .collect(Collectors.toMap(Question::getId, q -> q));

            double totalPossible = 0;
            double totalEarned = 0;

            for (Map.Entry<String, Map<String, Object>> entry : answers.entrySet()) {
                Long qid = Long.valueOf(entry.getKey());
                Double pointsEarned = gradedAnswers.get(qid);
                if (pointsEarned == null) pointsEarned = (Double) entry.getValue().get("pointsEarned");
                entry.getValue().put("pointsEarned", pointsEarned);

                Question q = questionMap.get(qid);
                if (q != null) {
                    totalPossible += q.getPoints();
                    totalEarned += pointsEarned;
                }
            }

            double percentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
            result.setMemoryScore(percentage);
            result.setAnswersJson(mapper.writeValueAsString(answers));
            log.info("Manually graded result {}: {}/{} = {}%", resultId, totalEarned, totalPossible, percentage);

        } catch (Exception e) {
            log.error("Error grading result", e);
            throw new RuntimeException("Error grading result", e);
        }

        return resultRepository.save(result);
    }

    public long countActiveStudents() {
        List<Long> userIds = resultRepository.findDistinctActiveUsers();
        return userIds.size();
    }

    public List<User> getActiveStudents() {
        List<Long> userIds = resultRepository.findDistinctActiveUsers();
        return userRepository.findAllById(userIds);
    }
}