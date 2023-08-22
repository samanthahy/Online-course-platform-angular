package com.mercury.OnlineCoursePlatformBackend.http.request;



public class CreateCourseRequest {
    private int instructorId;
    private String status;

    public int getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(int instructorId) {
        this.instructorId = instructorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
