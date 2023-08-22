package com.mercury.OnlineCoursePlatformBackend.http.response;

import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Lecture;
import com.mercury.OnlineCoursePlatformBackend.model.bean.LectureVideo;

public class UploadLectureVideoResponse extends Response {
    private Lecture lecture;

    public UploadLectureVideoResponse(boolean success, int code, String message, Lecture lecture) {
        super(success, code, message);
        this.lecture = lecture;
    }

    public UploadLectureVideoResponse(boolean success, String message) {
        super(success, message);
    }

    public Lecture getLecture() {
        return lecture;
    }

    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
    }
}