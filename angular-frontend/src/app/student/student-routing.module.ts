import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "../shared-module/profile/profile.component";
import {InstructorComponent} from "../instructor/instructor/instructor.component";
import {StudentComponent} from "./student/student.component";

const routes: Routes = [
  {
  path: '',  // root path for instructor module
  component: StudentComponent,
  children: [
  {
    path: 'profile',
    component: ProfileComponent
  }

  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
