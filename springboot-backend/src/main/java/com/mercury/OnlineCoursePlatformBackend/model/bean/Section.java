package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name="CP_SECTION")
public class Section {
    @Id
    @SequenceGenerator(name = "cp_section_seq_gen", sequenceName = "CP_SECTION_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_section_seq_gen", strategy = GenerationType.AUTO)
    private int id;
    private String title;
    @ManyToOne(fetch = FetchType.EAGER)
    private Course course;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "section")
    private List<Lecture> lectures;

    public Section() {
    }

    public Section(int id, String title, Course course, List<Lecture> lectures) {
        this.id = id;
        this.title = title;
        this.course = course;
        this.lectures = lectures;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @JsonIgnore
    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public List<Lecture> getLectures() {
        return lectures;
    }

    public void setLectures(List<Lecture> lectures) {
        this.lectures = lectures;
    }

    @Override
    public String toString() {
        return "Section{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", course=" + course.getName() +
                ", lectures number=" + lectures.size() +
                '}';
    }
}

