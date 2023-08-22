package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseDao extends JpaRepository<Course, Integer> {

    public Course findByName(String name);

    @Query("SELECT c.id, c.name, cat.name as categoryName " +
            "FROM Course c " +
            "JOIN c.category cat")
    List<CourseWithCategoryName> findAllCoursesWithCategoryNames();

    interface CourseWithCategoryName {
        int getId();
        String getName();
        String getCategoryName();
    }

    List<Course> findByInstructor_Id(int instructorId);


    @Query("SELECT c.id FROM Course c WHERE c.status = 'Published'")
    List<Integer> findIdsByStatus(String status);



}
