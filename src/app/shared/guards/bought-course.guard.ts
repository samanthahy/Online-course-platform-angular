import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {EnrollmentService} from "../services/enrollment.service";
import {Enrollment} from "../models/enrollment";

@Injectable({
  providedIn: 'root'
})
export class BoughtCourseGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private es: EnrollmentService, // assuming you have a service to check if a user bought a course
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseId = +route.paramMap.get('id')!;


    if (!this.auth.user) {
      this.router.navigate(['/login']);
      return of(false);  // Import 'of' from 'rxjs'
    }

    return this.es.getEnrollmentsForUser(this.auth.user.id).pipe(
      map((enrollments: Enrollment[]) => {
        const enrolledCourses = enrollments.map(e => e.course.id);
        const hasBoughtCourse = enrolledCourses.includes(courseId);

        if (!hasBoughtCourse) {
          this.router.navigate(['/unauthorized'], { queryParams: { reason: 'course_not_bought' } });
        }

        return hasBoughtCourse;
      }),
      catchError((error) => {
        console.error("An error occurred:", error);
        return of(false);  // This ensures that the route is not activated in case of an error
      })
    );
  }

}
