import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../../environments/environment.development";
import {Observable} from "rxjs";
import {Review} from "../models/review";

@Injectable()                // 想angular表明这是要给service，是可以注入的
export class ReviewService {
  constructor(private httpClient: HttpClient,
              private auth: AuthService) {}


  getReviews(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${environment.api}/reviews`);
  }


  getReviewsByCourse(courseId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${environment.api}/reviews/courseId/${courseId}`);
  }

  createReviewForUserCourse(newReviewData: any): Observable<Review> {
    const courseId = newReviewData.courseId;
    const userId = newReviewData.userId;
    const reviewData = {rating: newReviewData.rating, content: newReviewData.content};
    return this.httpClient.post<Review>(`${environment.api}/reviews/courseId/${courseId}/userId/${userId}`, reviewData);
  }


  updateReviewForUserCourse(existingReview: Review): Observable<Review> {
    const reviewId = existingReview.id;
    return this.httpClient.put<Review>(`${environment.api}/reviews/${reviewId}`,existingReview);
  }

  deleteReviewById(reviewId: number): Observable<{success: boolean}> {
    return this.httpClient.delete<{success: boolean}>(`${environment.api}/reviews/${reviewId}`);
  }




}
