package com.mercury.OnlineCoursePlatformBackend.controller;


import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Review;
import com.mercury.OnlineCoursePlatformBackend.model.dto.ReviewDTO;
import com.mercury.OnlineCoursePlatformBackend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {


    @Autowired
    private ReviewService reviewService;


    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }


    @GetMapping("/courseId/{courseId}")
    public List<Review> getReviewsByCourse(@PathVariable int courseId) {
        return reviewService.getReviewsByCourse(courseId);
    }


    @PostMapping("/courseId/{courseId}/userId/{userId}")
    public Review createReviewForUserCourse(
            @PathVariable int courseId,
            @PathVariable int userId,
            @RequestBody ReviewDTO reviewDTO
    ) {
        return reviewService.createReviewForUserCourse(courseId, userId, reviewDTO);
    }

    @PutMapping("/{reviewId}")
    public Review updateReviewForUserCourse(
            @PathVariable int reviewId,
            @RequestBody Review existingReview
    ) {
        return reviewService.updateReviewForUserCourse(reviewId, existingReview);
    }


    @DeleteMapping("/{reviewId}")
    public Response deleteReviewById(@PathVariable int reviewId) {
        return reviewService.deleteReviewById(reviewId);
    }
}
