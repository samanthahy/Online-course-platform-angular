package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.LectureVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface LectureVideoDao  extends JpaRepository<LectureVideo, Integer> {

    @Query("SELECT lv FROM LectureVideo lv WHERE lv.lectureId = :lectureId")
    LectureVideo findByLectureId(@Param("lectureId") int lectureId);

}
