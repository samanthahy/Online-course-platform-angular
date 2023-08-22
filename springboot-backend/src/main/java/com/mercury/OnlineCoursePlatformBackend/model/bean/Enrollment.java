package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "CP_ENROLLMENT")
public class Enrollment {
    @Id
    @SequenceGenerator(name = "cp_enrollment_seq_gen", sequenceName = "CP_ENROLLMENT_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_enrollment_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "course_id")
    private Course course;

    private double progress;

    private Date enrollDate;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "enrollment")
    @JoinColumn(name = "refund_id")
    private Refund refund;

    public Enrollment() {
    }

    public Enrollment(int id, User user, Course course, double progress, Date enrollDate, Refund refund) {
        this.id = id;
        this.user = user;
        this.course = course;
        this.progress = progress;
        this.enrollDate = enrollDate;
        this.refund = refund;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }

    public Date getEnrollDate() {
        return enrollDate;
    }

    public void setEnrollDate(Date enrollDate) {
        this.enrollDate = enrollDate;
    }

    public Refund getRefund() {
        return refund;
    }

    public void setRefund(Refund refund) {
        this.refund = refund;
    }

    @Override
    public String toString() {
        return "Enrollment{" +
                "id=" + id +
                ", user=" + user +
                ", course=" + course +
                ", progress=" + progress +
                ", enrollDate=" + enrollDate +
                ", refund=" + refund +
                '}';
    }
}
