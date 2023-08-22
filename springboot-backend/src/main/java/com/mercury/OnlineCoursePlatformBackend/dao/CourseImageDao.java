package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseImageDao  extends JpaRepository<CourseImage, Integer> {
    @Query("SELECT ci FROM CourseImage ci WHERE ci.courseId = :courseId")
    CourseImage findByCourseId(@Param("courseId") int courseId);

}
