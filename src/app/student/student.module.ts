import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { StudentComponent } from './student/student.component';
import {MatSidenavModule} from "@angular/material/sidenav";


@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModuleModule,
    MatSidenavModule
  ]
})
export class StudentModule { }
