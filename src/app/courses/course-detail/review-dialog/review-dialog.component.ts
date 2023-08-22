import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Review} from "../../../shared/models/review";
import {ReviewService} from "../../../shared/services/review.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})

export class ReviewDialogComponent implements OnInit {
  form: FormGroup;
  stars = new Array(5).fill(0); // To render 5 stars
  rating: number;
  content: string;
  existingReview: Review | null;
  userId: number | null = null;
  courseId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private rs: ReviewService,
    private snackBar: MatSnackBar
  ) {
    this.existingReview = data.existingReview;
    this.userId = data.userId;
    this.courseId = data.courseId;

  }


  ngOnInit() {
    this.form = this.fb.group({
      rating: [this.existingReview?.rating || 0, Validators.required],
      content: [this.existingReview?.content || '', Validators.required],
    });
    this.rating = this.form.get('rating')!.value; // Set the rating from the form value
  }


  setRating(starIndex: number): void {
    this.rating = starIndex + 1;
    this.form.get('rating')!.setValue(this.rating); // Update the form control value
  }


  submit(): void {
    const rating = this.form.get('rating')!.value;
    const content = this.form.get('content')!.value;
    if (this.existingReview) {
      this.existingReview.rating = rating;
      this.existingReview.content = content;
      this.rs.updateReviewForUserCourse(this.existingReview).subscribe(response => {
        this.openSnackBar('Successfully edited review');
        this.dialogRef.close(this.existingReview);
      });
      // rest of the logic remains the same
    } else {
      const newReview = {
        rating,
        content,
        userId: this.userId,
        courseId: this.courseId
      };

      this.rs.createReviewForUserCourse(newReview).subscribe(response => {
        this.openSnackBar('Successfully added review');
        // Handle the response, if needed, e.g., by using the newly created review
        this.dialogRef.close(response); // Assuming the response contains the newly created review
      });
    }
  }


  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
    });
  }




  delete(): void {
    if (this.existingReview) {
      this.rs.deleteReviewById(this.existingReview.id).subscribe(response => {
        if (response.success) {
          this.openSnackBar('Successfully deleted review');
          this.dialogRef.close({ action: 'DELETE', reviewId: this.existingReview!.id });
        } else {
          this.openSnackBar('Error deleting review');
        }
      });
    }
  }



  cancel(): void {
    this.dialogRef.close();
  }
}

