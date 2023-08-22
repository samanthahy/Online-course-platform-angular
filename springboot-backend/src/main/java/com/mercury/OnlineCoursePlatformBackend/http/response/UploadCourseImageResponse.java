package com.mercury.OnlineCoursePlatformBackend.http.response;

import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ProfileImage;

public class UploadCourseImageResponse extends Response {
    private CourseImage courseImage;

    public UploadCourseImageResponse(boolean success, int code, String message, CourseImage courseImage) {
        super(success, code, message);
        this.courseImage = courseImage;
    }

    public UploadCourseImageResponse(boolean success, String message) {
        super(success, message);
    }

    public CourseImage getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(CourseImage courseImage) {
        this.courseImage = courseImage;
    }
}