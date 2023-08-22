package com.mercury.OnlineCoursePlatformBackend.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.mercury.OnlineCoursePlatformBackend.util.Views;
import jakarta.persistence.*;


import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "CP_COURSE")
public class Course {
    @Id
    @SequenceGenerator(name = "cp_course_seq_gen", sequenceName = "CP_COURSE_SEQ", allocationSize = 1)
    @GeneratedValue(generator = "cp_course_seq_gen", strategy = GenerationType.IDENTITY)
    private int id;


    private String name;

    @OneToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    @Column(columnDefinition="TEXT")
    private String overview;

    @Column(name = "learning_outcomes")
    private String learningOutcomes;
//    @Convert(converter = StringListConverter.class)
//    private List<String> learningOutcomes;

    @Column(name = "prerequisites")
    private String prerequisites;

    @Column(columnDefinition="TEXT")
    private String description;


    private double rating;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


    private String level;


    private double price;

    @OneToOne
    @JoinColumn(name = "image_id")
    private CourseImage courseImage;


    private Integer discount;



    private String language;

    private String status;


    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL,mappedBy = "course")
    private List<Section> sectionList;

    public Course() {
    }

    public Course(int id, String name, User instructor, String overview, String learningOutcomes, String prerequisites, String description, double rating, Category category, String level, double price, CourseImage courseImage, Integer discount, String language, String status, List<Section> sectionList) {
        this.id = id;
        this.name = name;
        this.instructor = instructor;
        this.overview = overview;
        this.learningOutcomes = learningOutcomes;
        this.prerequisites = prerequisites;
        this.description = description;
        this.rating = rating;
        this.category = category;
        this.level = level;
        this.price = price;
        this.courseImage = courseImage;
        this.discount = discount;
        this.language = language;
        this.status = status;
        this.sectionList = sectionList;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLearningOutcomes() {
        return learningOutcomes;
    }

    public void setLearningOutcomes(String learningOutcomes) {
        this.learningOutcomes = learningOutcomes;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public CourseImage getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(CourseImage courseImage) {
        this.courseImage = courseImage;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Section> getSectionList() {
        return sectionList;
    }

    public void setSectionList(List<Section> sectionList) {
        this.sectionList = sectionList;
    }

    public String getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", instructor=" + instructor +
                ", overview='" + overview + '\'' +
                ", learningOutcomes='" + learningOutcomes + '\'' +
                ", prerequisites='" + prerequisites + '\'' +
                ", description='" + description + '\'' +
                ", rating=" + rating +
                ", category=" + category +
                ", level='" + level + '\'' +
                ", price=" + price +
                ", courseImage=" + courseImage +
                ", discount=" + discount +
                ", language='" + language + '\'' +
                ", status='" + status + '\'' +
                ", sectionList=" + sectionList +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Course course = (Course) o;
        return id == course.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
