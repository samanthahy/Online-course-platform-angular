import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Course} from "../../shared/models/course";
import {CourseService} from "../../shared/services/course.service";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {forkJoin, map, switchMap, tap} from "rxjs";
import {UserInfoService} from "../../shared/services/user-info.service";
import {PageEvent} from "@angular/material/paginator";
import {DialogComponent, DialogData} from "../../shared-module/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EnrollmentService} from "../../shared/services/enrollment.service";

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit{
  courses : Course[] = [];
  originalCourses : Course[] = [];
  displayedCourses: Course[] = []
  totalCourses = 0; // Total number of displayed courses
  pageSize = 10; // Number of courses per page
  pageSizeOptions: number[] = [5, 10, 25]; // Page size options

  courseEnrollmentsCountMap: Map<number, number> = new Map();
  instructorInfoMap: Map<number, string> = new Map();


  constructor(private cs: CourseService,
              private auth: AuthService,
              private router: Router,
              private uis: UserInfoService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private es: EnrollmentService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cs.getCourses().pipe(
      map(courses => courses.filter(course => course.status !== 'Draft')), // Filtering
      switchMap(courses => {
        // Store the courses
        this.originalCourses = courses;

        // Create an array of observables for each course to get enrollments and instructor info
        const observables = courses.map(course => {
          return forkJoin({
            enrollments: this.es.getEnrollmentsByCourse(course.id),
            instructorInfo: this.uis.getUserInfoByUserId(course.instructor.id)
          }).pipe(
            tap(result => {
              // Set enrollments count
              this.courseEnrollmentsCountMap.set(course.id, result.enrollments.length);

              // Set instructor name
              const instructorName = result.instructorInfo.firstname + ' ' + result.instructorInfo.lastname;
              this.instructorInfoMap.set(course.id, instructorName);
            })
          );
        });

        // Return combined observables
        return forkJoin(observables);
      })
    ).subscribe(
      () => {
        this.loadCourses(); // Load courses on successful completion
      },
      error => console.log(error) // Error handling
    );
  }


  loadCourses(pageIndex: number = 0): void {
    // Assuming this.originalCourses is the full array of courses
    this.courses = [...this.originalCourses]; // Start with all courses
    this.applyFilter(); // Apply any existing filter
    this.applyPagination(pageIndex); // Apply pagination
  }


  applyFilter(filterValue?: string): void {
    if (filterValue) {
      const filterValueLowerCase = filterValue.toLowerCase();
      this.courses = this.originalCourses.filter(course => {
        const instructorName = this.instructorInfoMap.get(course.id)?.toLowerCase() || '';
        return course.name.toLowerCase().includes(filterValueLowerCase) ||
          instructorName.includes(filterValueLowerCase);
      });
    } else {
      this.courses = [...this.originalCourses];
    }
    this.displayedCourses = this.courses;
    this.totalCourses = this.courses.length;
  }


  applyPagination(pageIndex: number = 0): void {
    this.displayedCourses = this.courses.slice(
      pageIndex * this.pageSize,
      (pageIndex + 1) * this.pageSize
    );
  }


  // Handle page change
  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.applyPagination(event.pageIndex); // Load courses for the new page
  }


  // Handle filter input change
  filterCourses(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.applyFilter(filterValue);
  }


  sortCoursesBy(field: 'name' | 'status' | 'instructor' | 'enrollments'): void {
    this.courses.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (field) {
        case 'name':
        case 'status':
          valueA = a[field];
          valueB = b[field];
          break;
        case 'instructor':
          valueA = this.instructorInfoMap.get(a.id) || '';
          valueB = this.instructorInfoMap.get(b.id) || '';
          break;
        case 'enrollments':
          valueA = this.courseEnrollmentsCountMap.get(a.id) || 0;
          valueB = this.courseEnrollmentsCountMap.get(b.id) || 0;
          break;
        default:
          throw new Error(`Unknown sort field: ${field}`);
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      }

      return 0;
    });
  }




  navigateToDetailPage(courseId: number) {
    this.router.navigate(['/course-detail', courseId]);
  }

  rejectCourse(courseId: number) {
    this.cs.changeCourseStatus(courseId, 'Draft').subscribe(
      (response) => {
        const data: DialogData = {
          title: 'Success',
          content: 'The course has been returned to the instructor'
        };
        // Success: Show a dialog, then navigate to 'instructor/courses'
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '250px',
          data
        });

        // Remove the rejected course from originalCourses
        const index = this.originalCourses.findIndex(course => course.id === courseId);
        if (index > -1) {
          this.originalCourses.splice(index, 1);
        }

        dialogRef.afterClosed().subscribe(() => {
          this.loadCourses(); // Assuming this method reloads the courses
        });
      },
      error => {
        // Error: Show a snackbar message
        this.snackBar.open('An error occurred. Please try to reject again.', 'Close', {
          duration: 5000
        });
      }
    );
  }


  approveCourse(courseId: number) {
    this.cs.changeCourseStatus(courseId, 'Published').subscribe(
      () => {
        // Find the index of the course with the given ID
        const index = this.originalCourses.findIndex(course => course.id === courseId);

        // If found, update the status
        if (index > -1) {
          this.originalCourses[index].status = 'Published';

          const data: DialogData = {
            title: 'Success',
            content: 'The course has been published'
          };
          // Success: Show a dialog, then navigate to 'instructor/courses'
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data
          });

          dialogRef.afterClosed().subscribe(() => {
            this.loadCourses(); // Assuming this method reloads the courses
          });
        }
      },
      error => {
        // Error: Show a snackbar message
        this.snackBar.open('An error occurred. Please try to publish again.', 'Close', {
          duration: 5000
        });
      }
    );
  }

  deactivateCourse(courseId: number) {
    this.cs.changeCourseStatus(courseId, 'Deactivated').subscribe(
      () => {
        // Find the index of the course with the given ID
        const index = this.originalCourses.findIndex(course => course.id === courseId);

        // If found, update the status
        if (index > -1) {
          this.originalCourses[index].status = 'Deactivated';

          const data: DialogData = {
            title: 'Success',
            content: 'The course has been deactivated'
          };

          // Success: Show a dialog
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data
          });

          dialogRef.afterClosed().subscribe(() => {
            this.loadCourses(); // Refresh the filtered and paginated list
          });
        }
      },
      error => {
        // Error: Show a snackbar message
        this.snackBar.open('An error occurred. Please try to deactivate again.', 'Close', {
          duration: 5000
        });
      }
    );
  }


  activateCourse(courseId: number) {
    this.cs.changeCourseStatus(courseId, 'Published').subscribe(
      () => {
        // Find the index of the course with the given ID
        const index = this.originalCourses.findIndex(course => course.id === courseId);

        // If found, update the status
        if (index > -1) {
          this.originalCourses[index].status = 'Published';

          const data: DialogData = {
            title: 'Success',
            content: 'The course has been activated again'
          };

          // Success: Show a dialog, then navigate to 'instructor/courses'
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data
          });

          dialogRef.afterClosed().subscribe(() => {
            this.loadCourses(); // Assuming this method reloads the courses
          });
        }
      },
      error => {
        // Error: Show a snackbar message
        this.snackBar.open('An error occurred. Please try to activate again.', 'Close', {
          duration: 5000
        });
      }
    );
  }
}
