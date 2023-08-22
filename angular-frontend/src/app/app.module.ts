import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './home/banner/banner.component';
import { LearnerReviewComponent } from './courses/course-detail/learner-review/learner-review.component';
import { CoursesComponent } from "./courses/courses.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseService } from "./shared/services/course.service";
import { CurrencyExchangePipe} from "./shared/pipes/currency-exchange.pipe";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import {CustomStyleModule} from "./shared/modules/custom-style/custom-style.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AuthInterceptor} from "./shared/interceptors/auth.interceptor";
import { AuthDialogComponent } from './auth/auth-dialog/auth-dialog.component';
import { ConfirmAddRoleDialogComponent } from './auth/confirm-add-role-dialog/confirm-add-role-dialog.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatDialogModule} from "@angular/material/dialog";
import {AuthService} from "./shared/services/auth.service";
import {TokenStorageService} from "./shared/services/token-storage.service";
import {UserService} from "./shared/services/user.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatPaginatorModule} from "@angular/material/paginator";
import {RatingFilterPipe} from "./shared/pipes/rating-filter.pipe";
import {LevelFilterPipe} from "./shared/pipes/level-filter.pipe";
import {LanguageFilterPipe} from "./shared/pipes/language-filter.pipe";
import {PriceFilterPipe} from "./shared/pipes/price-filter.pipe";
import {TopicFilterPipe} from "./shared/pipes/topic-filter.pipe";
import {CourseDetailComponent} from "./courses/course-detail/course-detail.component";
import {MatMenuModule} from "@angular/material/menu";
import { CategoryMenuComponent } from './header/category-menu/category-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoDialogComponent } from './courses/course-detail/video-dialog/video-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartItemComponent } from './order/cart-item/cart-item.component';
import { NoCoursesFoundComponent } from './courses/no-courses-found/no-courses-found.component';
import { CheckoutComponent } from './order/checkout/checkout.component'
import {TimeoutInterceptor} from "./shared/interceptors/timeoutInterceptor";
import { MatProgressBarComponent } from './order/mat-progress-bar/mat-progress-bar.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {SharedModuleModule} from "./shared-module/shared-module.module";
import {InstructorModule} from "./instructor/instructor.module";
import {AdminModule} from "./admin/admin.module";
import {StudentModule} from "./student/student.module";
import {S3Service} from "./shared/services/s3.service";
import {MatInputModule} from "@angular/material/input";
import { MyCoursesComponent } from './home/my-courses/my-courses.component';
import { CourseOverviewComponent } from './courses/course-overview/course-overview.component';
import { EnrolledCourseOverviewComponent } from './courses/enrolled-course-overview/enrolled-course-overview.component';
import {EnrollmentService} from "./shared/services/enrollment.service";
import {LearnComponent} from "./courses/course-detail/learn/learn.component";
import {PlayWindowComponent} from "./courses/course-detail/play-window/play-window.component";
import {ReviewService} from "./shared/services/review.service";
import { FooterComponent } from './footer/footer.component';
import { ReviewDialogComponent } from './courses/course-detail/review-dialog/review-dialog.component';
import {CommonModule} from "@angular/common";
import { ReceiptComponent } from './order/receipt/receipt.component';
import {CartService} from "./shared/services/cart.service";
import {NgChartsModule } from 'ng2-charts';
import {CarouselModule} from "ngx-bootstrap/carousel";
import { KeywordFilterPipe } from './shared/pipes/keyword-filter.pipe';
import { PurchaseHistoryComponent } from './home/purchase-history/purchase-history.component';



@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    CourseListComponent,
    CourseDetailComponent,
    HeaderComponent,
    BannerComponent,
    LearnerReviewComponent,
    CurrencyExchangePipe,
    RatingFilterPipe,
    LevelFilterPipe,
    LanguageFilterPipe,
    PriceFilterPipe,
    TopicFilterPipe,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AuthDialogComponent,
    ConfirmAddRoleDialogComponent,
    CategoryMenuComponent,
    VideoDialogComponent,
    CartItemComponent,
    NoCoursesFoundComponent,
    CheckoutComponent,
    MatProgressBarComponent,
    MyCoursesComponent,
    CourseOverviewComponent,
    EnrolledCourseOverviewComponent,
    LearnComponent,
    PlayWindowComponent,
    FooterComponent,
    ReviewDialogComponent,
    ReceiptComponent,
    KeywordFilterPipe,
    PurchaseHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CustomStyleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatMenuModule,
    NgbModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    SharedModuleModule,
    InstructorModule,
    AdminModule,
    StudentModule,
    CommonModule,
    NgChartsModule,
    CarouselModule.forRoot()
  ],
  providers: [
    CourseService,
    AuthService,
    TokenStorageService,
    UserService,
    S3Service,
    EnrollmentService,
    ReviewService,
    CartService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AuthDialogComponent]
})
export class AppModule { }










