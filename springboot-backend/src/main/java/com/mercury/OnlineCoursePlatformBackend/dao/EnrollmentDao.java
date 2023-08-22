package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentDao extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByCourseId(int courseId);

    List<Enrollment> findByUserId(int userId);


    Optional<Enrollment> findByCourseIdAndUserId(int courseId, int userId);


}
