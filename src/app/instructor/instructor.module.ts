import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorRoutingModule } from './instructor-routing.module';
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { InstructorComponent } from './instructor/instructor.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { InstructorCoursesComponent } from './instructor-courses/instructor-courses.component';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {NgbRating} from "@ng-bootstrap/ng-bootstrap";
import { ManageCourseComponent } from './manage-course/manage-course.component';
import {MatStepperModule} from "@angular/material/stepper";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {SafePipe} from "../shared/pipes/safe.pipe";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import { CurriculumComponent } from './manage-course/curriculum/curriculum.component';
import { BasicsComponent } from './manage-course/basics/basics.component';
import { GoalsComponent } from './manage-course/goals/goals.component';
import {EditorModule} from "@tinymce/tinymce-angular";
import { InstructorPerformanceComponent } from './instructor-performance/instructor-performance.component';
import {NgChartsModule} from "ng2-charts";


@NgModule({
    declarations: [
        InstructorComponent,
        InstructorCoursesComponent,
        ManageCourseComponent,
        SafePipe,
        CurriculumComponent,
        BasicsComponent,
        GoalsComponent,
        InstructorPerformanceComponent
    ],
    exports: [
        SafePipe
    ],
    imports: [
        CommonModule,
        InstructorRoutingModule,
        SharedModuleModule,
        MatSidenavModule,
        MatCardModule,
        FlexModule,
        NgbRating,
        MatStepperModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSelectModule,
        EditorModule,
      NgChartsModule
    ]
})
export class InstructorModule { }
