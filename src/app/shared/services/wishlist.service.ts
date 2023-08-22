import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Course} from "../models/course";
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistCoursesSubject =  new BehaviorSubject<Course[] | null>(null);


  constructor(private httpClient: HttpClient,
              private auth: AuthService) { }


  get wishlistCourses$() {
    return this.wishlistCoursesSubject.asObservable();
  }



  addToWishlist(courseId: number, userId: number): Observable<Course[]> {
    return this.httpClient.put<Course[]>(`${environment.api}/courses/${courseId}/add-to-user-wishlist/${userId}`, null)
      .pipe(
        tap(wishlistCourses => {
          console.log(wishlistCourses);
          this.wishlistCoursesSubject.next(wishlistCourses);

          if (this.auth.user) {
            // Now, update the user in AuthService
            const updatedUser = { ...this.auth.user, wishlistCourses };
            this.auth.updateUser(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Error in addToWishlist: ', error);
          return throwError(error);
        })
      );
  }

  removeFromWishlist(courseId: number, userId: number): Observable<Course[]> {
    return this.httpClient.put<Course[]>(`${environment.api}/courses/${courseId}/remove-from-user-wishlist/${userId}`, null)
      .pipe(
        tap(wishlistCourses => {
          this.wishlistCoursesSubject.next(wishlistCourses);

          if (this.auth.user) {
            // Now, update the user in AuthService
            const updatedUser = { ...this.auth.user, wishlistCourses };
            this.auth.updateUser(updatedUser);
          }
        }),
        catchError(error => {
          throw error;
        })
      );
  }


}
