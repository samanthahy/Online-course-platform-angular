package com.mercury.OnlineCoursePlatformBackend.http.request;

import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashMap;
import java.util.Map;

public class UpdateCourseBasicRequest {

    private static final Map<String, String> TRANSFORMATIONS = new HashMap<>();

    static {
        // Add transformations
        TRANSFORMATIONS.put("Python", "Python");
        TRANSFORMATIONS.put("Java", "Java");
        TRANSFORMATIONS.put("C#", "Csharp");
        TRANSFORMATIONS.put("React JS", "ReactJS");
        TRANSFORMATIONS.put("C++", "Cplusplus");
        TRANSFORMATIONS.put("JavaScript", "JavaScript");
        TRANSFORMATIONS.put("C", "C");
        TRANSFORMATIONS.put("Go", "Go");
        TRANSFORMATIONS.put("Angular", "Angular");
        TRANSFORMATIONS.put("CSS", "CSS");
        TRANSFORMATIONS.put("Node.Js", "NodeJS");
        TRANSFORMATIONS.put("Typescript", "Typescript");
        TRANSFORMATIONS.put("Machine Learning", "Machine_Learning");
        TRANSFORMATIONS.put("ChatGPT", "ChatGPT");
        TRANSFORMATIONS.put("TensorFlow", "TensorFlow");
        TRANSFORMATIONS.put("System Design", "System_Design");
        TRANSFORMATIONS.put("DevOps", "DevOps");
    }
    @NotNull(message = "Name must not be null")
    @Size(min = 1, message = "Name must not be empty")
    private String name;

    @NotNull(message = "Overview must not be null")
    private String overview;

    @NotNull(message = "Description must not be null")
    private String description;

    @NotNull(message = "Level must not be null")
    private String level;

    @NotNull(message = "Price must not be null")
    private Double price;

    @NotNull(message = "Language must not be null")
    private String language;

    @NotNull(message = "Main category must not be null")
    private String mainCategory;

    @NotNull(message = "Sub category must not be null")
    private String subCategory;

    @NotNull(message = "Topic must not be null")
    private String courseTopic;

    private CourseImage courseImage;

    public String getName() {
        return name;
    }

    public String getOverview() {
        return overview;
    }

    public String getDescription() {
        return description;
    }

    public String getLevel() {
        return level;
    }

    public Double getPrice() {
        return price;
    }

    public String getLanguage() {
        return language;
    }

    public String getMainCategory() {
        return mainCategory.replace(' ', '_');
    }

    public String getSubCategory() {
        return subCategory.replace(' ', '_');
    }

    public String getCourseTopic() {
        return transformCourseTopic(courseTopic);
    }

    public CourseImage getCourseImage() {
        return courseImage;
    }

    public String transformCourseTopic(String topic) {
        String transformedTopic = TRANSFORMATIONS.get(topic);
        if (transformedTopic == null) {
            // Handle the unknown topic as you see fit
            throw new IllegalArgumentException("Unknown topic: " + topic);
        }
        return transformedTopic;
    }

}


