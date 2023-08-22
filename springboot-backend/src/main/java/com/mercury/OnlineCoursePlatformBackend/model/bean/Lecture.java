package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.Duration;

@Entity
@Table(name = "CP_LECTURE")
public class Lecture {
    @Id
    @SequenceGenerator(name = "cp_lecture_seq_gen", sequenceName = "CP_LECTURE_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_lecture_seq_gen", strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Section section;
    private String title;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "video_id",referencedColumnName = "id")
    private LectureVideo lectureVideo;
    private Long duration;

    public Lecture() {
    }

    public Lecture(int id, Section section, String title, LectureVideo lectureVideo, Long duration) {
        this.id = id;
        this.section = section;
        this.title = title;
        this.lectureVideo = lectureVideo;
        this.duration = duration;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @JsonIgnore
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

    public LectureVideo getLectureVideo() {
        return lectureVideo;
    }

    public void setLectureVideo(LectureVideo lectureVideo) {
        this.lectureVideo = lectureVideo;
    }

    public Duration getDuration() {
        return duration != null ? Duration.ofSeconds(duration) : null;
    }

    public void setDuration(Duration duration) {
        this.duration = duration != null ? duration.getSeconds() : null;
    }

    @Override
    public String toString() {
        return "Lecture{" +
                "id=" + id +
                ", sectionId=" + section.getId() +
                ", title='" + title + '\'' +
                ", lectureVideo=" + lectureVideo +
                ", duration=" + duration +
                '}';
    }
}
