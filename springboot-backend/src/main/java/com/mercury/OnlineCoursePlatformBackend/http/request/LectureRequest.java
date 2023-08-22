package com.mercury.OnlineCoursePlatformBackend.http.request;

import java.time.Duration;

public class LectureRequest {
    private String lectureName;
    private Double duration;

    public Duration getDuration() {
        Long lectureDuration = duration != null ? Math.round(duration) : null;
        return duration != null ? Duration.ofSeconds(lectureDuration) : null;
    }

    public String getLectureName() {
        return lectureName;
    }
}
