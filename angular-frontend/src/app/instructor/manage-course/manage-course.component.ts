import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../../shared/services/course.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogComponent, DialogData} from "../../shared-module/dialog/dialog.component";

@Component({
  selector: 'app-manage-course',
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.scss']
})
export class ManageCourseComponent implements OnInit {
  isLinear = false;
  courseId: number;
  firstFormGroup: FormGroup = this._formBuilder.group({});
  secondFormGroup: FormGroup = this._formBuilder.group({});
  thirdFormGroup: FormGroup = this._formBuilder.group({});
  step1Completed = false;
  step2Completed = false;
  step3Completed = false;

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cs: CourseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) {}

  ngOnInit() {
  }

  onCompleteStep1() {
    this.step1Completed = true;
    this.stepper.next();
  }

  onCompleteStep2() {
    this.step2Completed = true;
    this.stepper.next();
  }

  onCompleteStep3() {
    this.step3Completed = true;
    this.stepper.next();
  }


  // Method to check if all components are complete
  allComponentsComplete(): boolean {
    return this.step1Completed && this.step2Completed && this.step3Completed; // Corrected line
  }


  // Method to submit course draft for review
  submitForReview(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });
    this.cs.changeCourseStatus(this.courseId, 'Pending approval').subscribe(
      (response) => {
        const data: DialogData = {
          title: 'Success',
          content: 'Your course has been submitted for review'
        };
        // Success: Show a dialog, then navigate to 'instructor/courses'
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '250px',
          data
        });

        dialogRef.afterClosed().subscribe(() => {
          // Relative navigation to 'instructor/courses'
          this.router.navigate(['/instructor/courses'], { relativeTo: this.route });
        });
      },
      error => {
        // Error: Show a snackbar message
        this.snackBar.open('An error occurred. Please try to submit again.', 'Close', {
          duration: 5000
        });
      }
    );
  }

}
