import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Course} from "../../../shared/models/course";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {CourseService} from "../../../shared/services/course.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {

  @Output() onComplete = new EventEmitter<void>();

  courseId: number;
  course: Course;

  form = this.fb.group({
    learning_outcomes: this.fb.array([
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required)
    ]),
    prerequisites: this.fb.array([
      this.fb.control('', Validators.required)
    ])
  });

  constructor(private fb: FormBuilder,
              private cs: CourseService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });
    this.cs.getCourseById(this.courseId).subscribe((course: Course) => {
      this.course = course;
      let learningOutcomes = course.learningOutcomes.split('!');
      let prerequisites = course.prerequisites.split('!');

      this.form.setControl('learning_outcomes', this.fb.array(
        learningOutcomes.map(outcome => this.fb.control(outcome, Validators.required))
      ));

      this.form.setControl('prerequisites', this.fb.array(
        prerequisites.map(prerequisite => this.fb.control(prerequisite, Validators.required))
      ));
    });
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    let learningOutcomes = '';
    let prerequisites = '';
    if (this.form.value.learning_outcomes) {
      learningOutcomes = this.form.value.learning_outcomes.join('!');
    }
    if (this.form.value.prerequisites) {
      prerequisites = this.form.value.prerequisites.join('!');
    }

    // Update the course
    this.cs.updateCourseGoals(this.courseId, learningOutcomes, prerequisites).subscribe(updatedCourse => {
      this.form.setControl('learning_outcomes', this.fb.array(updatedCourse.learningOutcomes.split('!'), Validators.required));
      this.form.setControl('prerequisites', this.fb.array(updatedCourse.prerequisites.split('!'), Validators.required));
      this.onComplete.emit();
    }, error => {
      console.error('An error occurred while updating the course goals:', error.message);
    });
  }


  get learningOutcomes() {
    return this.form.get('learning_outcomes') as FormArray;
  }

  get prerequisites() {
    return this.form.get('prerequisites') as FormArray;
  }

  addLearningOutcome() {
    this.learningOutcomes.push(this.fb.control(''));
  }

  addPrerequisite() {
    this.prerequisites.push(this.fb.control('', Validators.required));
  }

  isLearningOutcomesValid(): boolean {
    return (this.form.get('learning_outcomes') as FormArray).valid;
  }

  isPrerequisitesValid(): boolean {
    return (this.form.get('prerequisites') as FormArray).valid;
  }

  removeLearningOutcome(index: number) {
    this.learningOutcomes.removeAt(index);
  }

  removePrerequisite(index: number) {
    this.prerequisites.removeAt(index);
  }
}
