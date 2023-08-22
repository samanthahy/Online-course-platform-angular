import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CoursesComponent} from "./courses/courses.component";
import {AuthDialogComponent} from "./auth/auth-dialog/auth-dialog.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {HomeComponent} from "./home/home.component";
import {ProfileComponent} from "./shared-module/profile/profile.component";
import {CourseDetailComponent} from "./courses/course-detail/course-detail.component";
import {CartItemComponent} from "./order/cart-item/cart-item.component";
import {CheckoutComponent} from "./order/checkout/checkout.component";
import {MyCoursesComponent} from "./home/my-courses/my-courses.component";
import {LearnComponent} from "./courses/course-detail/learn/learn.component";
import {PlayWindowComponent} from "./courses/course-detail/play-window/play-window.component";
import {ReceiptComponent} from "./order/receipt/receipt.component";
import {PurchaseHistoryComponent} from "./home/purchase-history/purchase-history.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {NoAccessComponent} from "./shared-module/no-access/no-access.component";
import {BoughtCourseGuard} from "./shared/guards/bought-course.guard";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path:'home/my-courses',
    canActivate: [AuthGuard],
    component: MyCoursesComponent
  },

  {
    path:'home/purchase-history',
    canActivate: [AuthGuard],
    component: PurchaseHistoryComponent
  },

  {
    path: 'courses',
    component: CoursesComponent
  },

  {
    path: 'courses/:category',
    component: CoursesComponent
  },

  {
    path: 'courses/:category/:subcategory',
    component: CoursesComponent
  },

  {
    path: 'topic/:topic',
    component: CoursesComponent
  },

  {
    path:'course-detail/:id',
    component: CourseDetailComponent
  },

  {
    path:'course-detail/:id/learn/lecture/:lectureId',
    component: LearnComponent,
    canActivate: [BoughtCourseGuard],
    children: [
      { path: '', component: PlayWindowComponent }
    ]
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'cart',
    component: CartItemComponent
  },
  {
    path:'cart/checkout',
    canActivate: [AuthGuard],
    component: CheckoutComponent
  },
  {
    path:'receipt/:orderId',
    component: ReceiptComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'instructor',
    canLoad: [AuthGuard],
    data: {role: 'ROLE_INSTRUCTOR'},
    loadChildren: () => import('./instructor/instructor.module').then(m => m.InstructorModule)  // relative path to your admin module file
  },
  {
    path: 'admin',
    canLoad: [AuthGuard],
    data: {role: 'ROLE_ADMIN'},
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'student',
    canLoad: [AuthGuard],
    data: {role: 'ROLE_STUDENT'},
    loadChildren: () => import('./student/student.module').then(m => m.StudentModule)  // relative path to your admin module file
  },
  {
    path: 'unauthorized',
    component: NoAccessComponent
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
