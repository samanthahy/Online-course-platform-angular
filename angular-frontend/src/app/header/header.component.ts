import {
  Component,
  ComponentFactoryResolver, EventEmitter,
  Input,
  OnInit, Output,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {AuthDialogComponent, authDialogData} from "../auth/auth-dialog/auth-dialog.component";
import {ConfirmAddRoleDialogComponent} from "../auth/confirm-add-role-dialog/confirm-add-role-dialog.component";
import {filter, Observable, of, Subscription, switchMap, take, tap} from "rxjs";
import {CategoryService} from "../shared/services/category.service";
import {Category} from "../shared/models/category";
import {MatMenu} from "@angular/material/menu";
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {UserInfoService} from "../shared/services/user-info.service";
import {UserInfo} from "../shared/models/user-info";
import {CartService} from "../shared/services/cart.service";
import {CourseService} from "../shared/services/course.service";


type CategoryItems = {
  [key: string]: string | CategoryItems;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
  title = "Eureka"


  dialogRef: MatDialogRef<AuthDialogComponent | ConfirmAddRoleDialogComponent> | null = null;
  categories: Category[] = [];
  faShoppingCart = faShoppingCart;
  currentUser: UserInfo;
  loginSubscription?: Subscription;
  userInfoSubscription?: Subscription;

  categoriesSubscription?: Subscription;

  public cartItemCount$: Observable<number> = this.cartService.cartItemCount$;

  searchTerm: string = '';


  constructor(
    public auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private cs: CategoryService,
    private courseService: CourseService,
    private uis: UserInfoService,
    private cartService: CartService) {

    this.cartItemCount$ = this.cartService.cartItemCount$;
  }




  ngOnInit(): void {

    // Listen to auth user changes
    this.loginSubscription = this.auth.user$
      .pipe(
        filter(user => !!user),
        switchMap(user => this.uis.getUserInfoByUserId(user!.id))
      )
      .subscribe(userInfo => {
        this.currentUser = userInfo;
        this.uis.updateUserInfo(userInfo);
      });

    // Also listen to userInfo changes directly
    this.userInfoSubscription = this.uis.userInfo$
      .subscribe(userInfo => {
        if (userInfo) {
          this.currentUser = userInfo;
        }
      });

    this.categoriesSubscription = this.cs.getCategories()
      .subscribe(categories => {
        console.log('Fetched categories:', categories);
        this.categories = categories;
        this.cs.categories = categories;
      });
  }



  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }




  onSearchSubmit() {
    console.log("header",this.searchTerm); // For debugging purposes
    this.courseService.searchTermChanged.next(this.searchTerm);
  }



  onTeachOnUdemyClick() {
    if (this.dialogRef && this.dialogRef.componentInstance) {
      // If so, do nothing
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.maxWidth = '100%';
    dialogConfig.disableClose = false;
    dialogConfig.position = { top: '10%', left: 'calc(50vw - 200px)' };

    // console.log(dialogConfig);

    if (!this.auth.user) {
      // Open the AuthDialogComponent with mode 'register' for users that are not logged in
      dialogConfig.data = {mode: 'register'};
      this.dialogRef = this.dialog.open(AuthDialogComponent, dialogConfig);
    } else {
      console.log(this.auth.user.role);
      if (this.auth.user.role!=='ROLE_INSTRUCTOR') {
        // Open the ConfirmAddInstructorRoleDialogComponent for users that are logged in but not instructors
        this.dialogRef = this.dialog.open(ConfirmAddRoleDialogComponent, dialogConfig);
      } else {
        // Navigate to the course creation page for instructors
        this.router.navigate(['/instructor/courses']);
      }
    }

    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(result => {
        this.dialogRef = null;
      });
    }
  }


  convertRole(role: string): string {
    return role.replace('ROLE_', '').toLowerCase();
  }
}
