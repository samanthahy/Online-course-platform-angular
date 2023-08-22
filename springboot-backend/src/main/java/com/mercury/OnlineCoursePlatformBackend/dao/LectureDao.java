package com.mercury.OnlineCoursePlatformBackend.dao;

import com.mercury.OnlineCoursePlatformBackend.model.bean.Lecture;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Section;
import org.antlr.v4.runtime.Lexer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LectureDao extends JpaRepository<Lecture, Integer> {
}
