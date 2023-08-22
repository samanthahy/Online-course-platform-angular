package com.mercury.OnlineCoursePlatformBackend.model.bean;

import jakarta.persistence.*;

import java.sql.Timestamp;


@Entity
@Table(name = "CP_COURSE_IMAGE")
public class CourseImage {
    @Id
    @SequenceGenerator(name="cp_course_image_seq_gen", sequenceName = "CP_COURSE_IMAGE_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_course_image_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;
    private int courseId;
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

    public CourseImage() {
    }

    public CourseImage(int id, int courseId, String fileName, String filePath, Long fileSize, String s3ObjectKey, Timestamp uploadTime) {
        this.id = id;
        this.courseId = courseId;
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

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
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
        return "CourseImage{" +
                "id=" + id +
                ", courseId=" + courseId +
                ", fileName='" + fileName + '\'' +
                ", filePath='" + filePath + '\'' +
                ", fileSize='" + fileSize + '\'' +
                ", s3ObjectKey='" + s3ObjectKey + '\'' +
                ", uploadTime=" + uploadTime +
                '}';
    }
}
