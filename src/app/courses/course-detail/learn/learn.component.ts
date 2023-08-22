import {Component, OnInit} from '@angular/core';
import {Course} from "../../../shared/models/course";
import {CourseService} from "../../../shared/services/course.service";
import {forkJoin, switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ReviewService} from "../../../shared/services/review.service";
import {Review} from "../../../shared/models/review";
import {Lecture} from "../../../shared/models/lecture";
import {Section} from "../../../shared/models/section";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {EnrollmentService} from "../../../shared/services/enrollment.service";
import {Enrollment} from "../../../shared/models/enrollment";
import {UserInfo} from "../../../shared/models/user-info";
import {UserInfoService} from "../../../shared/services/user-info.service";

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {
  courseId: number;
  lectureId: number;
  course: Course;
  reviews: Review[] = [];
  enrollments: Enrollment[] = [];
  instructor: UserInfo;
  loading: boolean = true;
  isExpanded: boolean[] = [];


  constructor(private cs: CourseService,
              private ar: ActivatedRoute,
              private router: Router,
              private rs: ReviewService,
              private es: EnrollmentService,
              private uis: UserInfoService) {
  }



  ngOnInit(): void {
    this.ar.paramMap
      .pipe(
        switchMap(params => {
          this.courseId = Number(params.get('id'));
          this.lectureId = Number(params.get('lectureId'));
          return this.cs.getCourseById(this.courseId);
        }),
        switchMap(course => {
          this.course = course;

          // Initialize the isExpanded array here
          if (!this.isExpanded || this.isExpanded.length === 0) {
            this.isExpanded = Array(this.course.sectionList.length).fill(false);
            this.isExpanded[0] = true;
          }


          return forkJoin({
            instructor: this.uis.getUserInfoByUserId(course.instructor.id),
            enrollments: this.es.getEnrollmentsByCourse(this.courseId),
            reviews: this.rs.getReviewsByCourse(this.courseId),
          });
        })
      )
      .subscribe({
        next: ({ instructor, enrollments, reviews }) => {
          this.instructor = instructor;
          this.enrollments = enrollments;
          this.reviews = reviews;
          this.loading = false;
        },
        error: err => {
          console.error('An error occurred:', err);
          this.loading = false; // Make sure to set loading to false in case of error
        }
      });
  }




  tabChanged(event: MatTabChangeEvent) {
    let fragment: string = 'overview'; // default fragment
    switch (event.index) {
      case 0:
        fragment = 'overview';
        break;
      case 1:
        fragment = 'reviews';
        break;
    }
    this.router.navigate(
      ['/course-detail', this.course.id, 'learn', 'lecture', this.lectureId],
      { fragment }
    );
  }


  markAsExpanded(index: number): void {
    console.log('markAsExpanded called with index:', index);
    console.log('isExpanded array before markAsExpanded:', this.isExpanded);
    this.isExpanded[index] = true;
    console.log('isExpanded array after markAsExpanded:', this.isExpanded);
  }

  markAsCollapsed(index: number): void {
    console.log('markAsCollapsed called with index:', index);
    this.isExpanded[index] = false;
    console.log('isExpanded array after markAsCollapsed:', this.isExpanded);
  }



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

    return Math.round(totalDurationInSeconds/60).toString();
  }


  getTotalCourseDuration(course: Course): string {
    const totalDurationInSeconds = course.sectionList.reduce((total, section) => {
      return total + section.lectures.reduce((total, lecture) => {
        return total + this.durationToSeconds(lecture.duration);
      }, 0);
    }, 0);

    return Math.round(totalDurationInSeconds/3600).toString();
  }



// Function to get total number of lectures in a course
  getTotalLectures(course: Course): number {
    return course.sectionList.reduce((total, section) => {
      return total + section.lectures.length;
    }, 0);
  }



}
