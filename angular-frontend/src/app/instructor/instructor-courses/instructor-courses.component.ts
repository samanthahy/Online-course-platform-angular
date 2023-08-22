import { Component } from '@angular/core';
import {CourseService} from "../../shared/services/course.service";
import {Course} from "../../shared/models/course";
import {AuthService} from "../../shared/services/auth.service";
import {Enrollment} from "../../shared/models/enrollment";
import {switchMap} from "rxjs";
import {NewCourse} from "../../shared/models/new-course";
import {Router} from "@angular/router";
import {EnrollmentService} from "../../shared/services/enrollment.service";

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.scss']
})
export class InstructorCoursesComponent {
  courses : Course[] = [];
  courseEnrollmentsCountMap: Map<number, number> = new Map();

  starRatingMap: Map<number, number> = new Map();
  constructor(private cs: CourseService,
              private auth: AuthService,
              private router: Router,
              private es: EnrollmentService) { }

  ngOnInit(): void {
    if (this.auth.user) {
      this.cs.getCoursesByInstructor(this.auth.user.id).subscribe(
        data => {
          this.courses = data;
          this.courses.forEach(course => {
            this.es.getEnrollmentsByCourse(course.id).subscribe(
              enrollments => {
                this.courseEnrollmentsCountMap.set(course.id, enrollments.length);
                this.starRatingMap.set(course.id, course.rating);
              },
              error => {
                console.log(error);
              }
            );
          })
        },
        error => {
          console.log(error);
        }
      );
    }
  }



  createNewCourse() {
    if (this.auth.user) {
      let newCourse: NewCourse = {
        instructorId: this.auth.user.id,
        status: 'Draft'
      };

      this.cs.createCourse(newCourse).subscribe(
        data => {
          // Navigate to the new course manage/goals page
          this.router.navigate([`/instructor/courses/${data.id}/manage/goals`]);
        },
        error => {
          console.log(error);
        }
      );
    }

  }

  navigateToEditPage(course: Course) {
    this.router.navigate([`/instructor/courses/${course.id}/manage/goals`]);
  }
}
