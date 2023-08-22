import {Injectable} from "@angular/core";
import {Enrollment} from "../models/enrollment";
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../../environments/environment.development";
import {bottom} from "@popperjs/core";

@Injectable()
export class EnrollmentService {

  constructor(private httpClient: HttpClient) {}


  getEnrollments():Observable<Enrollment[]> {
  return this.httpClient.get<Enrollment[]>(`${environment.api}/enrollments`);
  }


  getEnrollmentsForUser(userId: number): Observable<Enrollment[]> {
    return this.httpClient.get<Enrollment[]>(`${environment.api}/enrollments/userId/${userId}`);
  }


  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    return this.httpClient.get<Enrollment[]>(`${environment.api}/enrollments/courseId/${courseId}`);
  }

  checkEnrollmentByCourseAndUser(courseId: number, userId: number): Observable<boolean> {
    return this.httpClient.get<Enrollment>(`${environment.api}/enrollments/courseId/${courseId}/userId/${userId}`).pipe(
      map(response => {
        if (response) { // if the response body contains an Enrollment object
          return true;
        } else { // if the response body is empty
          return false;
        }
      }),
      catchError(err => {
        console.error('An error occurred:', err);
        return of(false); // in case of an error, default to 'not enrolled'
      })
    );
  }
}
