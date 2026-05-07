package com.example.webapp.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tests")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("sectionOrder ASC")
    @JsonIgnoreProperties("test")
    private List<Section> sections = new ArrayList<>();

    public Test() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<Section> getSections() { return sections; }
    public void setSections(List<Section> sections) {
        this.sections = sections;
        if (sections != null) {
            for (Section s : sections) s.setTest(this);
        }
    }
}