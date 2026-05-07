package com.example.webapp.dto;

import com.example.webapp.model.Section;
import com.example.webapp.model.Question;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

public class TestDTO {
    private Long id;
    private String title;
    private List<SectionDTO> sections;
    private List<QuestionDTO> questions;

    public TestDTO(com.example.webapp.model.Test test) {
        this.id = test.getId();
        this.title = test.getTitle();
        this.questions = new ArrayList<>();
        if (test.getSections() != null) {
            this.sections = test.getSections().stream()
                    .map(SectionDTO::new)
                    .collect(Collectors.toList());
            for (Section section : test.getSections()) {
                if (section.getQuestions() != null) {
                    for (Question q : section.getQuestions()) {
                        this.questions.add(new QuestionDTO(q));
                    }
                }
            }
        } else {
            this.sections = List.of();
        }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<SectionDTO> getSections() { return sections; }
    public void setSections(List<SectionDTO> sections) { this.sections = sections; }
    public List<QuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDTO> questions) { this.questions = questions; }

    // Inner DTO for Section (unchanged)
    public static class SectionDTO {
        private Long id;
        private String title;
        private Integer sectionOrder;
        private List<QuestionDTO> questions;

        public SectionDTO(Section section) {
            this.id = section.getId();
            this.title = section.getTitle();
            this.sectionOrder = section.getSectionOrder();
            if (section.getQuestions() != null) {
                this.questions = section.getQuestions().stream()
                        .map(QuestionDTO::new)
                        .collect(Collectors.toList());
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Integer getSectionOrder() { return sectionOrder; }
        public void setSectionOrder(Integer sectionOrder) { this.sectionOrder = sectionOrder; }
        public List<QuestionDTO> getQuestions() { return questions; }
        public void setQuestions(List<QuestionDTO> questions) { this.questions = questions; }
    }

    // Inner DTO for Question (unchanged)
    public static class QuestionDTO {
        private Long id;
        private String questionText;
        private String type;
        private String options;
        private String correctAnswer;
        private Double points;
        private String mediaUrl;
        private Integer questionOrder;

        public QuestionDTO(Question question) {
            this.id = question.getId();
            this.questionText = question.getQuestionText();
            this.type = question.getType();
            this.options = question.getOptions();
            this.correctAnswer = question.getCorrectAnswer();
            this.points = question.getPoints();
            this.mediaUrl = question.getMediaUrl();
            this.questionOrder = question.getQuestionOrder();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getOptions() { return options; }
        public void setOptions(String options) { this.options = options; }
        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
        public Double getPoints() { return points; }
        public void setPoints(Double points) { this.points = points; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public Integer getQuestionOrder() { return questionOrder; }
        public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
    }
}