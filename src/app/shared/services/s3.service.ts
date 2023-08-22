import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../../environments/environment.development";
import {Lecture} from "../models/lecture";
import {Course} from "../models/course";
import {CourseImage} from "../models/course-image";
@Injectable()
export class S3Service {
// S3Service


  constructor(private httpClient: HttpClient,
              private auth: AuthService) {}



  uploadLectureVideo(file: File, lectureId: number): Observable<HttpEvent<Lecture>> {
    console.log("uploadLectureVideo called");
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<Lecture>(`${environment.api}/s3/upload/lectureVideo/${lectureId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  uploadCourseImage(file: File, courseId: number): Observable<CourseImage> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<CourseImage>(`${environment.api}/s3/upload/courseImage/${courseId}`, formData);
  }



}
