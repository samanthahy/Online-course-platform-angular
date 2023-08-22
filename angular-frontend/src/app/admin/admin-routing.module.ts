import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "../shared-module/profile/profile.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminCoursesComponent} from "./admin-courses/admin-courses.component";
import {AdminUsersComponent} from "./admin-users/admin-users.component";
import {AdminPerformanceComponent} from "./admin-performance/admin-performance.component";
import {AdminOrdersComponent} from "./admin-orders/admin-order.component";

const routes: Routes = [
  {
    path: '',  // root path for admin module
    component: AdminComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },

      {
        path: 'courses',
        component: AdminCoursesComponent
      },

      {
        path: 'users',
        component: AdminUsersComponent
      },

      {
        path: 'performance',
        component: AdminPerformanceComponent
      },
      {
        path: 'orders',
        component: AdminOrdersComponent
      }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
