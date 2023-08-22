package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "CP_QUIZ")
public class Quiz {
    @Id
    @SequenceGenerator(name = "cp_quiz_seq_gen", sequenceName = "CP_QUIZ_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_quiz_seq_gen", strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    private Section section;
    private String title;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "quiz")
    private List<QuizQuestion> questionList;

    public Quiz() {
    }

    public Quiz(int id, Section section, String title, List<QuizQuestion> questionList) {
        this.id = id;
        this.section = section;
        this.title = title;
        this.questionList = questionList;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<QuizQuestion> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<QuizQuestion> questionList) {
        this.questionList = questionList;
    }

    @Override
    public String toString() {
        return "Quiz{" +
                "id=" + id +
                ", section=" + section +
                ", title='" + title + '\'' +
                ", questionList=" + questionList +
                '}';
    }
}
