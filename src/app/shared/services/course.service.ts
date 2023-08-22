import {Component, Injectable} from "@angular/core";
import {Course} from "../models/course";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, Subject, switchMap, throwError} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {Enrollment} from "../models/enrollment";
import {AuthService} from "./auth.service";
import {ShoppingSession} from "../models/shopping-session";
import {CartItem} from "../models/cart-item";
import {NewCourse} from "../models/new-course";
import {Section} from "../models/section";
import {Lecture} from "../models/lecture";

@Injectable()                // 想angular表明这是要给service，是可以注入的
export class CourseService {
  courses: Course [] | undefined;
  cartItems: Course [] = [];
  cartTotalValue: number = 0;



  // This is the subject we use to communicate the search term.
  searchTermChanged = new Subject<string>();




  constructor(private httpClient: HttpClient,
              private auth: AuthService) {}


  getCourses(): Observable<Course []> {
    return this.httpClient.get<Course []> (`${environment.api}/courses`)
  }



  getCourseById(id: number): Observable< Course > {
    return this.httpClient.get<Course>(`${environment.api}/courses/${id}`);          // callback function 返回true or false， find 返回Product或undefined
  }



  getCoursesByInstructor(instructorId: number): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${environment.api}/courses/instructorId/${instructorId}`);
  }


  getPromotedCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${environment.api}/courses/promoted-courses`);
  }



  getCourseByName(courseName: string): Observable<Course> {
    return this.httpClient.get<Course>(`${environment.api}/courses/courseName/${courseName}`);
  }




  createCourse(course: NewCourse): Observable<Course> {
    return this.httpClient.post<Course>(`${environment.api}/courses`, course);
  }


  updateCourseGoals(courseId: number, learningOutcomes: string, prerequisites: string): Observable<Course> {
    const courseGoals = { learningOutcomes, prerequisites };
    return this.httpClient.put<Course>(`${environment.api}/courses/${courseId}/goals`, courseGoals)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }


  updateCourseBasics(courseId: number, courseData: any): Observable<Course> {
    return this.httpClient.put<Course>(`${environment.api}/courses/${courseId}/basics`, courseData)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }



  getLectureById(lectureId: number): Observable<Lecture> {
    return this.httpClient.get<Lecture>(`${environment.api}/courses/lectures/${lectureId}`)
  }



  deleteLecture(sectionId: number, lectureId: number ) : Observable<void> {
    return this.httpClient.delete<void>(`${environment.api}/courses/section/${sectionId}/lecture/${lectureId}`)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }


  deleteSection(sectionId: number) : Observable<void> {
    return this.httpClient.delete<void>(`${environment.api}/courses/sections/${sectionId}`)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }



  createSection(courseId: number, sectionName: string): Observable<Section> {
    const sectionData = {
      sectionName: sectionName
    }
    return this.httpClient.post<Section>(`${environment.api}/courses/${courseId}/sections`, sectionData)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }



  createLecture(sectionId: number, lectureName: string, duration: number): Observable<Lecture> {
    const lectureData = {
      lectureName: lectureName,
      duration: duration
    };
    return this.httpClient.post<Lecture>(`${environment.api}/courses/sections/${sectionId}/lectures`, lectureData)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }


  editLectureName(lectureName: string, lectureId: number) : Observable<Lecture> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.put<Lecture>(`${environment.api}/courses/lectures/${lectureId}`,lectureName, { headers })
      .pipe(
      catchError(error => {
        throw error;
      })
    );
  }



  editSectionName(sectionName: string, sectionId: number) : Observable<Section> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.put<Section>(`${environment.api}/courses/sections/${sectionId}`,sectionName, { headers })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }


  changeCourseStatus(courseId: number, status: string): Observable<boolean> {
    return this.httpClient.put<boolean>(`${environment.api}/courses/${courseId}/status`, status)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }





}
