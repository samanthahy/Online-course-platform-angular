import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "../shared-module/profile/profile.component";
import {InstructorComponent} from "./instructor/instructor.component";
import {InstructorCoursesComponent} from "./instructor-courses/instructor-courses.component";
import {ManageCourseComponent} from "./manage-course/manage-course.component";
import {CurriculumComponent} from "./manage-course/curriculum/curriculum.component";
import {BasicsComponent} from "./manage-course/basics/basics.component";
import {GoalsComponent} from "./manage-course/goals/goals.component";
import {InstructorPerformanceComponent} from "./instructor-performance/instructor-performance.component";


const routes: Routes = [
  {
    path: '',  // root path for instructor module
    component: InstructorComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },

      {
        path: 'courses',
        component: InstructorCoursesComponent
      },

      {
        path: 'courses/:id/manage',
        component: ManageCourseComponent,
        children: [
          {
            path: 'goals',
            component: GoalsComponent
          },
          {
            path: 'curriculum',
            component: CurriculumComponent
          },
          {
            path: 'basics',
              component: BasicsComponent
          },
          {
            path: '',   // This can be a default route if none of the above paths matches
            redirectTo: 'goals',
            pathMatch: 'full'
          }
        ]
      },

      {
        path: 'performance',
        component: InstructorPerformanceComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
