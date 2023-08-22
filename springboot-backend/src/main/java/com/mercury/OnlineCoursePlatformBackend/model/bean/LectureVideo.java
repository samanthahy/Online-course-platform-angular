package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

import java.sql.Timestamp;


@Entity
@Table(name = "CP_LECTURE_VIDEO")
public class LectureVideo {

    @Id
    @SequenceGenerator(name="cp_lecture_video_seq_gen", sequenceName = "CP_LECTURE_VIDEO_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_lecture_video_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;
    private int lectureId;
    @Column(name = "file_name")
    private String fileName;
    @Column(name = "file_path")
    private String filePath;
    @Column(name = "file_size")
    private Long fileSize;
    @Column(name = "s3_object_key")
    private String s3ObjectKey;
    @Column(name="upload_time")
    private Timestamp uploadTime;

    public LectureVideo() {
    }

    public LectureVideo(int id, int lectureId, String fileName, String filePath, Long fileSize, String s3ObjectKey, Timestamp uploadTime) {
        this.id = id;
        this.lectureId = lectureId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.s3ObjectKey = s3ObjectKey;
        this.uploadTime = uploadTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getLectureId() {
        return lectureId;
    }

    public void setLectureId(int lectureId) {
        this.lectureId = lectureId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getS3ObjectKey() {
        return s3ObjectKey;
    }

    public void setS3ObjectKey(String s3ObjectKey) {
        this.s3ObjectKey = s3ObjectKey;
    }

    public Timestamp getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(Timestamp uploadTime) {
        this.uploadTime = uploadTime;
    }

    @Override
    public String toString() {
        return "LectureVideo{" +
                "id=" + id +
                ", lectureId=" + lectureId +
                ", fileName='" + fileName + '\'' +
                ", filePath='" + filePath + '\'' +
                ", fileSize='" + fileSize + '\'' +
                ", s3ObjectKey='" + s3ObjectKey + '\'' +
                ", uploadTime=" + uploadTime +
                '}';
    }
}
