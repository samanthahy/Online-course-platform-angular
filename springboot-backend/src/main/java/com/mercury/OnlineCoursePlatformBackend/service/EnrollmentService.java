package com.mercury.OnlineCoursePlatformBackend.service;


import com.mercury.OnlineCoursePlatformBackend.dao.EnrollmentDao;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EnrollmentService {


    @Autowired
    EnrollmentDao enrollmentDao;

    @Autowired
    UserDao userDao;


    public List<Enrollment> getAllEnrollments() {
        return enrollmentDao.findAll();
    }


    public List<Enrollment> getEnrollmentsForUser(int userId) {
        return enrollmentDao.findByUserId(userId);
    }


    public Response createEnrollmentFromOrder(Order order) {
        User user = userDao.findById(order.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User not found with id " + order.getUserId()));

        for (OrderCourse orderCourse : order.getPurchases()) {
            Course course = orderCourse.getCourse();

            Enrollment enrollment = new Enrollment();
            enrollment.setUser(user);
            enrollment.setCourse(course);
            enrollment.setEnrollDate(new Date());
            enrollment.setProgress(0.0);

            // Save the enrollment to the database
            enrollmentDao.save(enrollment);
        }
        return new Response(true, 200, "Successfully created enrollments for order");
    }


    public List<Enrollment> getEnrollmentsByCourseId(int courseId) {
        return enrollmentDao.findByCourseId(courseId);
    }


    public Optional<Enrollment> checkEnrollmentByCourseAndUser(int courseId, int userId) {
        return enrollmentDao.findByCourseIdAndUserId(courseId, userId);
    }

}
