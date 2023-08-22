import {Component, OnInit} from "@angular/core";
import {Course} from "../../shared/models/course";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../../shared/services/course.service";
import {forkJoin, Observable, switchMap, tap, map, throwError, Subscription, of, catchError} from "rxjs";
import {UserInfoService} from "../../shared/services/user-info.service";
import {UserInfo} from "../../shared/models/user-info";
import {Enrollment} from "../../shared/models/enrollment";
import {Section} from "../../shared/models/section";
import {Lecture} from "../../shared/models/lecture";
import {MatDialog} from "@angular/material/dialog";
import {VideoDialogComponent} from "./video-dialog/video-dialog.component";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {faCheck, faFilm} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import {EnrollmentService} from "../../shared/services/enrollment.service";
import {Review} from "../../shared/models/review";
import {ReviewService} from "../../shared/services/review.service";
import {CartService} from "../../shared/services/cart.service";
import {AuthService} from "../../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WishlistService} from "../../shared/services/wishlist.service";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})

export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  id: number | undefined;
  instructorInfo: UserInfo;
  enrollments: Enrollment[] = [];
  enrollmentCount: number = 0;
  starRating: number = 0;
  learningOutcomes: string[] = [];
  description: SafeHtml | undefined;
  prerequisites: string[] = [];
  filmIcon = faFilm;
  checkIcon = faCheck;
  faStar = farStar;
  reviews: Review[];
  userInfosMap: Map<number, any> = new Map(); // Modify the type as needed
  subscription: Subscription;
  isInWishlist: boolean = false;
  isInCart: boolean = false;
  isEnrolled: boolean = false;
  farHeart = farHeart;
  fasHeart = fasHeart;


  // ActivatedRoute => snapShot => params.id 用于将id取出来
  constructor(
    private ar: ActivatedRoute,
    private cs: CourseService,
    private uis: UserInfoService,
    private router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private es: EnrollmentService,
    private rs: ReviewService,
    private cartService: CartService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private ws: WishlistService
  ) {}



  ngOnInit(): void {
    this.ar.paramMap
      .pipe(
        switchMap(params => {
          const id = Number(params.get('id'));
          if (!id) {
            throw new Error("Invalid course ID");
          }
          this.id = id;
          return this.cs.getCourseById(this.id);
        }),
        tap(course => {
          if (!course) {
            throw new Error("Course not found");
          }
          this.course = course;
          this.starRating = course.rating;
          this.learningOutcomes = course.learningOutcomes.split("!");
          this.prerequisites = course.prerequisites.split("!");
          this.description = this.sanitizer.bypassSecurityTrustHtml(this.course.description);
        }),
        // Check if course is in cart and if user is enrolled
        switchMap(course => {
          return forkJoin({
            isInCart: this.cartService.getCoursesInCart().pipe(
              map(coursesInCart => coursesInCart.some(c => c.id === course.id))
            ),
            isEnrolled: this.auth.user ? this.es.checkEnrollmentByCourseAndUser(course.id, this.auth.user.id) : of(false)
          });
        }),
        tap(results => {
          this.isInCart = results.isInCart;
          this.isEnrolled = results.isEnrolled;
        }),
        switchMap(() => forkJoin({
          enrollments: this.es.getEnrollmentsByCourse(this.course!.id),
          reviews: this.rs.getReviewsByCourse(this.course!.id),
          instructorInfo: this.uis.getUserInfoByUserId(this.course!.instructor.id)
        })),
        switchMap(data => {
          this.enrollments = data.enrollments;
          this.enrollmentCount = data.enrollments.length;
          this.reviews = data.reviews; // Storing the reviews
          this.instructorInfo = data.instructorInfo;

          // Fetching user info for each review
          const userInfosRequests = this.reviews.map(review => this.uis.getUserInfoByUserId(review.user.id)); // Adjust the property as needed
          return forkJoin(userInfosRequests);
        })
      )
      .subscribe({
        next: userInfos => {
          this.reviews.forEach((review, index) => this.userInfosMap.set(review.id, userInfos[index]));
        },
        error: err => console.log(err),
        complete: () => console.log('getCourseDetail, getInstructorInfo, getEnrollment, and getReviews finished')
      });

    this.subscription = this.auth.user$.subscribe(user => {
      this.checkIfCourseInWishlist();
    });
  }


  checkIfCourseInWishlist(): void {
    if (this.auth.user && this.auth.user.wishlistCourses && this.id) {
      this.isInWishlist = this.auth.user.wishlistCourses.some(course => course.id === this.id);
    } else {
      this.isInWishlist = false;
    }
  }


  goToCart(): void {
    // Navigate to your cart page
    this.router.navigate(['/cart']);
  }

  goToCourse(): void {
    // Navigate to the specific course content page
    this.router.navigate(this.getCourseLink(this.course!));
  }



  getCourseLink(course: Course): string[] {
    const lectureId = this.getFirstLectureId(course);

    if (lectureId !== null) {
      return ['/course-detail', course.id.toString(), 'learn', 'lecture', lectureId.toString()];
    } else {
      // Handle the case where lectureId is null, for example, you might redirect to a default route
      return ['/course-detail', course.id.toString()];
    }
  }


  getFirstLectureId(course: Course): number | null {
    for (const section of course.sectionList) {
      if (section.lectures && section.lectures.length > 0) {
        return section.lectures[0].id;
      }
    }
    return null; // Return null if no lecture ID is found
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  /*ngOnInit(): void {
  this.ar.paramMap
    .pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) {
          // Handle the case where id is not defined or invalid, maybe redirect or show an error message
          throw new Error("Invalid course ID");
        }
        this.id = id;
        return this.cs.getCourse(this.id);
      }),
      tap(course => {
        if (!course) {
          // Handle the case where course is not found
          throw new Error("Course not found");
        }
        this.course = course;
        this.starRating = course.rating;
        this.learningOutcomes = course.learningOutcomes.split("!");
        this.prerequisites = course.prerequisites.split("!");
        this.description = this.sanitizer.bypassSecurityTrustHtml(this.course.description);
      }),
      switchMap(course => forkJoin({
        enrollments: this.es.getEnrollmentsByCourse(course.id),
        reviews: this.rs.getReviewsByCourse(course.id),
        instructorInfo: this.uis.getUserInfoByUserId(course.instructor.id)
      }))
    )
    .subscribe({
      next: data => {
        this.enrollments = data.enrollments;
        this.enrollmentCount = data.enrollments.length;
        this.reviews = data.reviews; // Storing the reviews
        this.instructorInfo = data.instructorInfo;
      },
      error: err => console.log(err),
      complete: () => console.log('getCourseDetail, getInstructorInfo, getEnrollment, and getReviews finished')
    });
}*/






      /* ------------ Duration transformation  -----------------*/


// Function to convert duration string to seconds
  durationToSeconds(duration: any): number {
    if (!duration) {
      return 0;
    }

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (match[1])
      hours = parseInt(match[1].replace('H', ''));
    if (match[2])
      minutes = parseInt(match[2].replace('M', ''));
    if (match[3])
      seconds = parseInt(match[3].replace('S', ''));

    return hours * 3600 + minutes * 60 + seconds;
  }


  // Function to convert seconds to time format
  secondsToTimeFormat(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    const formattedHours = ("0" + hours).slice(-2);
    const formattedMinutes = ("0" + minutes).slice(-2);
    const formattedSeconds = ("0" + seconds).slice(-2);

    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }


  // Function to get lecture duration in time format
  getLectureDuration(lecture: Lecture): string {
    const durationInSeconds = this.durationToSeconds(lecture.duration);
    return this.secondsToTimeFormat(durationInSeconds);
  }


  // Function to get total section duration in time format
  getTotalSectionDuration(section: Section): string {
    const totalDurationInSeconds = section.lectures.reduce((total, lecture) => {
      return total + this.durationToSeconds(lecture.duration);
    }, 0);

    return this.secondsToTimeFormat(totalDurationInSeconds);
  }


  // Function to get total course duration in time format
  getTotalCourseDuration(course: Course): string {
    const totalDurationInSeconds = course.sectionList.reduce((total, section) => {
      return total + section.lectures.reduce((total, lecture) => {
        return total + this.durationToSeconds(lecture.duration);
      }, 0);
    }, 0);

    return this.secondsToTimeFormat(totalDurationInSeconds);
  }

// Function to get total number of lectures in a course
  getTotalLectures(course: Course): number {
    return course.sectionList.reduce((total, section) => {
      return total + section.lectures.length;
    }, 0);
  }



  openDialog(event:Event, url: string) {
    event.preventDefault();
    // transform the URL to YouTube's embed URL structure
    this.dialog.open(VideoDialogComponent, {
      data: { url: url }
    });
  }



  addToCart(course: Course) {
    this.cartService.addToCart(course);
    this.isInCart = true;
  }



  toggleWishlist(courseId: number) {
    if (this.auth.user) {
      if (this.isInWishlist) {
        // Call your remove from wishlist service function
        this.ws.removeFromWishlist(courseId, this.auth.user.id).subscribe(
          res => {
            this.isInWishlist = false; // Update the state
            this.snackBar.open('The course has been removed from your wishlist', 'Close', { duration: 5000 });
          },
          error => {
            this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 5000 });
          }
        );
      } else {
        this.ws.addToWishlist(courseId, this.auth.user.id).subscribe(
          res => {
            this.isInWishlist = true; // Update the state
            this.snackBar.open('The course has been added to your wishlist', 'Close', { duration: 5000 });
          },
          error => {
            this.snackBar.open('An error occurred. Please try to add again.', 'Close', { duration: 5000 });
          }
        );
      }
    } else {
      // If not authenticated, redirect to login
      localStorage.setItem('returnUrl', this.router.url);
      this.router.navigate(['/login']);
    }
  }







}
