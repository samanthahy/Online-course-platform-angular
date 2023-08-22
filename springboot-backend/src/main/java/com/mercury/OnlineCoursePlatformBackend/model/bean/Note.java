package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.Duration;


@Entity
@Table(name= "CP_NOTE")
public class Note {
    @Id
    @SequenceGenerator(name = "cp_note_seq_gen", sequenceName = "CP_NOTE_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_note_seq_gen", strategy = GenerationType.AUTO)
    private int id;
    private int userId;
    private int lectureId;

    private Long noteTime;
    private String noteContent;
    private Timestamp createTime;
    private Timestamp updateTime;

    public Note() {
    }

    public Note(int id, int userId, int lectureId, Long noteTime, String noteContent, Timestamp createTime, Timestamp updateTime) {
        this.id = id;
        this.userId = userId;
        this.lectureId = lectureId;
        this.noteTime = noteTime;
        this.noteContent = noteContent;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getLectureId() {
        return lectureId;
    }

    public void setLectureId(int lectureId) {
        this.lectureId = lectureId;
    }

    public Long getNoteTime() {
        return noteTime;
    }

    public void setNoteTime(Long noteTime) {
        this.noteTime = noteTime;
    }

    public String getNoteContent() {
        return noteContent;
    }

    public void setNoteContent(String noteContent) {
        this.noteContent = noteContent;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", userId=" + userId +
                ", lectureId=" + lectureId +
                ", noteTime=" + noteTime +
                ", noteContent='" + noteContent + '\'' +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
