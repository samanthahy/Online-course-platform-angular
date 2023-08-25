import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Review} from "../../../shared/models/review";
import {UserInfo} from "../../../shared/models/user-info";
import {UserInfoService} from "../../../shared/services/user-info.service";
import {MatDialog} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {AuthService} from "../../../shared/services/auth.service";
import {Course} from "../../../shared/models/course";

@Component({
  selector: 'app-learner-review',
  templateUrl: './learner-review.component.html',
  styleUrls: ['./learner-review.component.scss']
})
export class LearnerReviewComponent implements OnInit {
  @Input() reviews: Review[] = [];

  @Input() course: Course;
  filteredReviews: Review[] = [];
  selectedLevel: number | null = null;
  percentages: number[] = [];
  userInfosMap: Map<number, UserInfo> = new Map(); // Map to store user info
  form: FormGroup;

  ratingDistribution: any = {
    5: 30, // example percentage for 5 stars
    4: 20,
    3: 10,
    2: 20,
    1: 20
  };

  constructor(private fb: FormBuilder,
              private uis: UserInfoService,
              private dialog: MatDialog,
              private auth: AuthService) {
    this.form = this.fb.group({
      rating: [0]
    });
  }

  ngOnInit(): void {
    this.calculatePercentages();
    this.filterReviews(this.selectedLevel ?? 0);
    this.fetchUserInfos();
  }

  fetchUserInfos() {
    for (let review of this.reviews) {
      // Assuming you have a method getUserInfoByUserId in your user service
      this.uis.getUserInfoByUserId(review.user.id).subscribe(userInfo => {
        this.userInfosMap.set(review.id, userInfo);
      });
    }
  }


  calculatePercentages() {
    const ratingCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const totalReviews = this.reviews.length;

    this.reviews.forEach(review => {
      ratingCounts[review.rating]++;
    });

    this.percentages = [];
    for (let i = 5; i >= 1; i--) {
      const percent = (ratingCounts[i] / totalReviews) * 100;
      this.percentages.push(percent);
    }
  }



  filterReviews(level: number) {
    this.selectedLevel = level;

    // Filter the reviews based on the selected level
    if (this.selectedLevel > 0) {
      this.filteredReviews = this.reviews.filter(review => review.rating === this.selectedLevel);
    } else {
      this.filteredReviews = this.reviews; // If no level is selected, show all reviews
    }
  }


  selectLevel(level: number) {
    this.filterReviews(level);
  }

  clearSelection() {
    this.selectedLevel = null; // or 0, depending on your logic
    this.filterReviews(0);
  }


  openReviewDialog() {
    if (this.auth.user) {
      const existingReview = this.reviews.find(
        review => this.auth.user!.id === review.user.id
      );

    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '550px',
      height: '550px',
      data: {
        existingReview: existingReview, // assuming this is defined elsewhere
        userId: this.auth.user.id, // assuming this is how you access the user ID
        courseId: this.course.id // assuming you have access to the course ID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'DELETE') {
        this.handleReviewDeletion(result.reviewId);
      } else if (result && result.action !== 'DELETE') {
        this.handleNewReview(result);
      }
    });
    }
  }


  handleNewReview(review: Review): void {
    const index = this.reviews.findIndex(r => r.id === review.id);

    if (index === -1) {
      // New review, add it to the beginning
      this.reviews.unshift(review);

      // Fetch the UserInfo for this new review and add to userInfosMap
      this.uis.getUserInfoByUserId(review.user.id).subscribe(userInfo => {
        this.userInfosMap.set(review.id, userInfo);
      });

    } else {
      // Existing review, update it
      this.reviews[index] = review;
    }

    // recalculate the rating percentage
    this.calculatePercentages();

    // Update your filteredReviews if necessary
    this.filteredReviews = [...this.reviews]; // assuming filteredReviews is derived from reviews
  }



  handleReviewDeletion(reviewId: number): void {
    // Find and remove the review from your local reviews array
    const index = this.reviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      this.reviews.splice(index, 1);
      this.filteredReviews = [...this.reviews];
    }
    // Optionally, remove the UserInfo from the userInfosMap
    this.userInfosMap.delete(reviewId);
  }




  timeAgo(timestamp: Date) {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
      return 'just now';
    }
    if (secondsPast < 3600) {
      return `${parseInt((secondsPast / 60).toString())} minute${parseInt((secondsPast / 60).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 86400) {
      return `${parseInt((secondsPast / 3660).toString())} hour${parseInt((secondsPast / 3660).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 604800) {
      return `${parseInt((secondsPast / 86400).toString())} day${parseInt((secondsPast / 86400).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 2419200) {
      return `${parseInt((secondsPast / 804800).toString())} week${parseInt((secondsPast / 804800).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 29030400) {
      return `${parseInt((secondsPast / 2419200).toString())} month${parseInt((secondsPast / 2419200).toString()) > 1 ? 's' : ''} ago`;
    }

    return `${parseInt((secondsPast / 29030400).toString())} year${parseInt((secondsPast / 29030400).toString()) > 1 ? 's' : ''} ago`;
  }



}
