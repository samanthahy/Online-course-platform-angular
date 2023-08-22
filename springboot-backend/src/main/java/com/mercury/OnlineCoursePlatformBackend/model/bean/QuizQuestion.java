package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

@Entity
@Table(name = "CP_QUIZ_QUESTION")
public class QuizQuestion {
    @Id
    @SequenceGenerator(name="cp_quiz_question_seq_gen", sequenceName = "CP_QUIZ_QUESTION_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_quiz_question_seq_gen", strategy = GenerationType.AUTO)
    private int id;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    private Quiz quiz;
    private String question;
    private String choice1;
    private String choice2;
    private String choice3;
    private int answer;

    public QuizQuestion() {
    }

    public QuizQuestion(int id, Quiz quiz, String question, String choice1, String choice2, String choice3, int answer) {
        this.id = id;
        this.quiz = quiz;
        this.question = question;
        this.choice1 = choice1;
        this.choice2 = choice2;
        this.choice3 = choice3;
        this.answer = answer;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getChoice1() {
        return choice1;
    }

    public void setChoice1(String choice1) {
        this.choice1 = choice1;
    }

    public String getChoice2() {
        return choice2;
    }

    public void setChoice2(String choice2) {
        this.choice2 = choice2;
    }

    public String getChoice3() {
        return choice3;
    }

    public void setChoice3(String choice3) {
        this.choice3 = choice3;
    }

    public int getAnswer() {
        return answer;
    }

    public void setAnswer(int answer) {
        this.answer = answer;
    }

    @Override
    public String toString() {
        return "QuizQuestion{" +
                "id=" + id +
                ", quiz=" + quiz +
                ", question='" + question + '\'' +
                ", choice1='" + choice1 + '\'' +
                ", choice2='" + choice2 + '\'' +
                ", choice3='" + choice3 + '\'' +
                ", answer=" + answer +
                '}';
    }
}
