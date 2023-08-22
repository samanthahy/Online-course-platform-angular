package com.mercury.OnlineCoursePlatformBackend.service;


import com.mercury.OnlineCoursePlatformBackend.dao.CourseDao;
import com.mercury.OnlineCoursePlatformBackend.dao.ReviewDao;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Review;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.model.dto.ReviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    ReviewDao reviewDao;

    @Autowired
    UserDao userDao;

    @Autowired
    CourseDao courseDao;


    public List<Review> getAllReviews() {
        return reviewDao.findAll();
    }


    public List<Review> getReviewsByCourse(int courseId) {
        return reviewDao.findByCourseId(courseId);
    }


    public Review createReviewForUserCourse(int courseId, int userId, ReviewDTO reviewDTO) {
        Course course = courseDao.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + courseId));
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        Review review = new Review();
        review.setCourse(course);
        review.setUser(user);
        review.setRating(reviewDTO.getRating());
        review.setContent(reviewDTO.getContent());
        review.setCreateTime(new Timestamp(new Date().getTime())); // sets current timestamp
        return reviewDao.save(review);
    }

    public Review updateReviewForUserCourse(int reviewId, Review existingReview) {
        Review dbReview = reviewDao.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id " + reviewId));
        dbReview.setRating(existingReview.getRating());
        dbReview.setContent(existingReview.getContent());
        dbReview.setUpdateTime(new Timestamp(new Date().getTime())); // sets current timestamp

        return reviewDao.save(dbReview);
    }


    public Response deleteReviewById(int reviewId) {
        Optional<Review> review = reviewDao.findById(reviewId);
        if (review.isPresent()) {
            reviewDao.deleteById(reviewId);
            return new Response(true);
        } else {
            return new Response(false);
        }
    }



}
