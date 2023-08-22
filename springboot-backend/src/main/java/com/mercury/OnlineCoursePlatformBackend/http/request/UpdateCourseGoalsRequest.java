package com.mercury.OnlineCoursePlatformBackend.http.request;

public class UpdateCourseGoalsRequest {

    private String learningOutcomes;
    private String prerequisites;

    public String getLearningOutcomes() {
        return learningOutcomes;
    }

    public void setLearningOutcomes(String learningOutcomes) {
        this.learningOutcomes = learningOutcomes;
    }

    public String getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }
}
