package com.mercury.OnlineCoursePlatformBackend.controller;


import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Enrollment;
import com.mercury.OnlineCoursePlatformBackend.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    EnrollmentService enrollmentService;


    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }


    @GetMapping("/userId/{userId}")
    public List<Enrollment> getEnrollmentsForUser(@PathVariable int userId) {
        return enrollmentService.getEnrollmentsForUser(userId);
    }



    @GetMapping("/courseId/{courseId}")
    public List<Enrollment> getEnrollments(@PathVariable int courseId) {
        return enrollmentService.getEnrollmentsByCourseId(courseId);
    }


    @GetMapping("/courseId/{courseId}/userId/{userId}")
    public ResponseEntity<?> checkEnrollmentByCourseAndUser(@PathVariable int courseId, @PathVariable int userId) {
        Optional<Enrollment> enrollmentOpt = enrollmentService.checkEnrollmentByCourseAndUser(courseId, userId);

        if (enrollmentOpt.isPresent()) {
            return ResponseEntity.ok(enrollmentOpt.get());
        } else {
            return ResponseEntity.ok().build();  // or you can return some status/message indicating no enrollment found.
        }
    }


}
