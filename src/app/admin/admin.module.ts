import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { AdminComponent } from './admin/admin.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import { AdminUsersComponent } from './admin-users/admin-users.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import {MatDialogModule} from "@angular/material/dialog";
import { EditRoleDialogComponent } from './admin-users/edit-role-dialog/edit-role-dialog.component';
import { AdminPerformanceComponent } from './admin-performance/admin-performance.component';
import {NgChartsModule} from "ng2-charts";
import {MatListModule} from "@angular/material/list";
import { AdminOrdersComponent } from './admin-orders/admin-order.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminCoursesComponent,
    AdminUsersComponent,
    EditRoleDialogComponent,
    AdminPerformanceComponent,
    AdminOrdersComponent
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModuleModule,
        MatSidenavModule,
        MatCardModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatDialogModule,
        MatRadioModule,
        FormsModule,
        NgChartsModule,
        MatListModule

    ],
  providers: [DatePipe]
})
export class AdminModule { }
