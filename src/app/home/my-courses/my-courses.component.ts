import {Component, OnDestroy, OnInit} from '@angular/core';
import {Course} from "../../shared/models/course";
import {CourseService} from "../../shared/services/course.service";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/user";
import {EnrollmentService} from "../../shared/services/enrollment.service";
import {Enrollment} from "../../shared/models/enrollment";
import {UserService} from "../../shared/services/user.service";
import {UserInfoService} from "../../shared/services/user-info.service";
import {UserInfo} from "../../shared/models/user-info";
import {Subject, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit, OnDestroy{

  enrollments: Enrollment[] = [];
  wishlistCourses: Course[] = [];
  currentUser: User | undefined;
  instructorsMap: Map<number, UserInfo> = new Map();
  private unsubscribe$ = new Subject<void>();

  messageTitleEnrollment = "You don't have any enrolled courses";
  messageTitleWishlist = "Your wishlist is empty";
  messageDescription = " Keep browsing to find a course!";


  constructor(
    private cs: CourseService,
    private auth: AuthService,
    private es: EnrollmentService,
    private uis: UserInfoService) {
  }

/*  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.wishlistCourses = user.wishlistCourses;
        this.es.getEnrollmentsForUser(this.currentUser.id).subscribe(enrollments => {
          this.enrollments = enrollments;
        });
        this.fetchInstructors();
      } else {
        // Reset the values if user logs out
        this.wishlistCourses = [];
        this.enrollments = [];
      }
    });
  }*/


  ngOnInit(): void {
    this.auth.user$
      .pipe(
        takeUntil(this.unsubscribe$), // Unsubscribe logic
        switchMap(user => {
          if (user) {
            this.currentUser = user;
            this.wishlistCourses = user.wishlistCourses;
            return this.es.getEnrollmentsForUser(this.currentUser.id);
          } else {
            // Reset the values if user logs out
            this.wishlistCourses = [];
            this.enrollments = [];
            return [];
          }
        })
      )
      .subscribe(enrollments => {
        this.enrollments = enrollments;
        this.fetchInstructors(); // Assuming fetchInstructors does not return an observable.
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  fetchInstructors() {
    // Combine both enrollments and wishlistCourses into a single array
    const allCourses = [...this.enrollments.map(e => e.course), ...this.wishlistCourses];

    // Loop through the courses and fetch the instructor information
    allCourses.forEach(course => {
      this.uis.getUserInfoByUserId(course.instructor.id).subscribe(instructor => {
        this.instructorsMap.set(course.id, instructor);
      });
    });
  }

}
