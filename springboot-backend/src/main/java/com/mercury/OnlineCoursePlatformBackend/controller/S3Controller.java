package com.mercury.OnlineCoursePlatformBackend.controller;


import com.mercury.OnlineCoursePlatformBackend.http.response.UploadProfileImageResponse;
import com.mercury.OnlineCoursePlatformBackend.model.bean.CourseImage;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Lecture;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ProfileImage;
import com.mercury.OnlineCoursePlatformBackend.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/s3")
public class S3Controller {


    @Autowired
    public S3Service s3Service;

    @PostMapping("/upload/profileImage/{userId}")
    public ProfileImage uploadProfileFile(@RequestParam("file") MultipartFile file, @PathVariable int userId) {
        return s3Service.uploadProfileImage(file, userId);
    }


    @PostMapping("/upload/lectureVideo/{lectureId}")
    public Lecture uploadLectureVideo(@RequestParam("file") MultipartFile file, @PathVariable int lectureId) {
        return s3Service.uploadLectureVideo(file, lectureId);
    }


    @PostMapping("/upload/courseImage/{courseId}")
    public CourseImage uploadCourseImage(@RequestParam("file") MultipartFile file, @PathVariable int courseId) {
        return s3Service.uploadCourseImage(file, courseId);
    }


}
