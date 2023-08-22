package com.mercury.OnlineCoursePlatformBackend.controller;

import com.mercury.OnlineCoursePlatformBackend.http.request.*;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.bean.*;
import com.mercury.OnlineCoursePlatformBackend.service.CourseService;
import com.mercury.OnlineCoursePlatformBackend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;


    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public List<Course> getAll() {
        return courseService.getAll();
    }


    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable int id) {
        return courseService.getCourseById(id);
    }

    @GetMapping("/name/{name}")
    public Course getCourseByName(@PathVariable String name) {
        return courseService.getCourseByName(name);
    }

    @GetMapping("/instructorId/{instructorId}")
    public List<Course> getCourseByInstructor(@PathVariable int instructorId) {
        return courseService.getCourseByInstructor(instructorId);
    }




    @GetMapping("/lectures/{lectureId}")
    public Lecture getLectureById(@PathVariable int lectureId) {
        return courseService.getLectureById(lectureId);
    }

    @GetMapping("/promoted-courses")
    public List<Course> findRandomCourses() {
        return courseService.findRandomCourses();
    }




    @PostMapping
    public Course createNewCourse(@RequestBody CreateCourseRequest createCourseRequest) {
        return courseService.createNewCourse(createCourseRequest);
    }


    @PostMapping("/{courseId}/sections")
    public Section createSection(@PathVariable int courseId, @RequestBody CreateSectionRequest createSectionRequest) {
        return courseService.createSection(courseId, createSectionRequest.getSectionName());
    }



    @PostMapping("/sections/{sectionId}/lectures")
    public Lecture createLecture(@PathVariable int sectionId, @RequestBody LectureRequest lectureRequest) {
        return courseService.createLecture(sectionId, lectureRequest.getLectureName(), lectureRequest.getDuration());
    }


/*    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PostMapping
    public void save(@RequestBody Course course) {
        System.out.println("Saving: " + course);
        courseService.save(course);
    }*/

    @PutMapping("/sections/{sectionId}")
    public Section editSectionName(@PathVariable int sectionId, @RequestBody String sectionName) {
        return courseService.editSectionName(sectionId, sectionName);
    }

    @PutMapping("/lectures/{lectureId}")
    public Lecture editLectureName(@PathVariable int lectureId, @RequestBody String lectureName) {
        return courseService.editLectureName(lectureId, lectureName);
    }


    @PutMapping("/{courseId}/goals")
    public Course updateCourseGoals(@RequestBody UpdateCourseGoalsRequest updateCourseGoalsRequest, @PathVariable int courseId) {
        return courseService.saveCourseGoals(updateCourseGoalsRequest, courseId);
    }


    @PutMapping("/{courseId}/basics")
    public Course updateCourseBasics(@RequestBody UpdateCourseBasicRequest updateCourseBasicRequest, @PathVariable int courseId) {
        return courseService.saveCourseBasics(updateCourseBasicRequest, courseId);
    }


    @PutMapping("/{courseId}/status")
    public Response changeCourseStatus(@RequestBody String status, @PathVariable int courseId) {
        return courseService.changeCourseStatus(status, courseId);
    }



    @PutMapping("/{courseId}/add-to-user-wishlist/{userId}")
    public List<Course> addToWishlist(@PathVariable int courseId, @PathVariable int userId) {
        return wishlistService.addToWishlist(courseId, userId);
    }




    @PutMapping("/{courseId}/remove-from-user-wishlist/{userId}")
    public List<Course> removeFromWishlist(@PathVariable int courseId, @PathVariable int userId) {
        return wishlistService.removeFromWishlist(courseId, userId);
    }




/*    @GetMapping("/pdf")
    public ResponseEntity<InputStreamResource> getProductsInPDF() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=products.pdf");

        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(courseService.getCoursesInPDF()));
    }*/




    @DeleteMapping("/section/{sectionId}/lecture/{lectureId}")
    public Response deleteLecture(@PathVariable int sectionId, @PathVariable int lectureId) {
        return courseService.deleteLecture( sectionId, lectureId);
    }


    @DeleteMapping("/sections/{sectionId}")
    public Response deleteSection(@PathVariable int sectionId) {
        return courseService.deleteSection(sectionId);
    }

}
