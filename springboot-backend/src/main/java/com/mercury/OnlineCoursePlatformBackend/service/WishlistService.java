package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.dao.CourseDao;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class WishlistService {

    @Autowired
    private CourseDao courseDao;


    @Autowired
    private UserDao userDao;


    public List<Course> addToWishlist(int courseId, int userId) {
        Course dbCourse = courseDao.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found for id: " + courseId));
        User dbUser = userDao.findById(userId).orElseThrow(() -> new RuntimeException("User not found for id: " + userId));
        dbUser.getWishlistCourses().add(dbCourse);
        userDao.save(dbUser);

        return dbUser.getWishlistCourses();
    }




    public List<Course> removeFromWishlist(int courseId, int userId) {
        Course dbCourse = courseDao.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found for id: " + courseId));
        User dbUser = userDao.findById(userId).orElseThrow(() -> new RuntimeException("User not found for id: " + userId));

        // Remove the course from the user's wishlist
        dbUser.getWishlistCourses().remove(dbCourse);
        userDao.save(dbUser);

        return dbUser.getWishlistCourses();
    }




}
