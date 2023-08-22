package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileImageDao  extends JpaRepository<ProfileImage, Integer> {
    @Query("SELECT pi FROM ProfileImage pi WHERE pi.userId = :userId")
    ProfileImage findByUserId(@Param("userId") int userId);

}
