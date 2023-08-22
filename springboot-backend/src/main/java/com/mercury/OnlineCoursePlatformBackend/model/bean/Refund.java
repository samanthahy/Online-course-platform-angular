package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "CP_REFUND")
public class Refund {
    @Id
    @SequenceGenerator(name = "cp_refund_seq_gen", sequenceName = "CP_REFUND_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_refund_seq_gen", strategy = GenerationType.AUTO)
    private int id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;
    private Date requestDate;
    private String status;
    private String description;

    public Refund() {
    }

    public Refund(int id, Enrollment enrollment, Date requestDate, String status, String description) {
        this.id = id;
        this.enrollment = enrollment;
        this.requestDate = requestDate;
        this.status = status;
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @JsonIgnore
    public Enrollment getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(Enrollment enrollment) {
        this.enrollment = enrollment;
    }

    public Date getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Date requestDate) {
        this.requestDate = requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Refund{" +
                "id=" + id +
                ", enrollment=" + enrollment +
                ", requestDate=" + requestDate +
                ", status='" + status + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
