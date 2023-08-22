import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {User} from "../../shared/models/user";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../shared/services/user.service";
import {UserInfoService} from "../../shared/services/user-info.service";
import {FormControl} from "@angular/forms";
import {catchError, forkJoin, map, merge, of, startWith, switchMap, tap} from "rxjs";
import {Page} from "../../shared/models/page";
import {UserInfo} from "../../shared/models/user-info";
import {DatePipe} from "@angular/common";
import {EditRoleDialogComponent} from "./edit-role-dialog/edit-role-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  displayedColumns: string[] = [ 'email', 'phone', 'status', 'role', 'joinedDate', 'menu'];
  users: User[];
  resultsLength = 0;
  pageSize: number = 10;
  isLoadingResults = true;
  filterControl = new FormControl('');
  userInfoMap: Map<number, UserInfo> = new Map();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpClient: HttpClient,
              private us: UserService,
              private uis: UserInfoService,
              private cdr: ChangeDetectorRef,
              private datePipe: DatePipe,
              private dialog: MatDialog,
              private auth: AuthService,
              private snackBar: MatSnackBar) {
  }


  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.filterControl.valueChanges.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.filterControl.valueChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.us.getUsersWithFilterSortPaginator(
            this.sort.active || 'email',
            this.sort.direction.toUpperCase() || 'ASC',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.filterControl.value || '' // Pass the filter value
          ).pipe(catchError(() => of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 0 })));
        }),
        switchMap((page: Page<User>) => {
          this.resultsLength = page.totalElements;
          // If there are users, fetch their UserInfos.
          if (page && page.content && page.content.length > 0) {
            return forkJoin(
              page.content.map((user: User) =>
                this.uis.getUserInfoByUserId(user.id).pipe(
                  tap((userInfo: UserInfo) => {
                    this.userInfoMap.set(user.id, userInfo);
                  })
                )
              )
            ).pipe(
              map(() => page.content) // after fetching UserInfos, return the users
            );
          } else {
            // if there are no users, just return an empty array
            return of([]);
          }
        }),
        tap(() => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
        })
      )
      .subscribe(data => {
        this.users = data;
        this.cdr.detectChanges();
      });
  }

  onPageSizeChange() {
    this.paginator.pageIndex = 0; // reset to the first page
    this.paginator._changePageSize(this.pageSize); // trigger a page change event
  }


  toggleRoleSort() {
    // Check if the current active sort is 'role'
    if (this.sort.active === 'role') {
      this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort.active = 'role';
      this.sort.direction = 'desc'; // or 'asc', depends on your preference for the first click
    }

    // Trigger sort change event
    this.sort.sortChange.emit({
      active: this.sort.active,
      direction: this.sort.direction
    });
  }


  getRoleDisplayName(role: string): string {
    if (role.startsWith('ROLE_')) {
      return role.split('_')[1].charAt(0).toUpperCase() + role.split('_')[1].slice(1).toLowerCase();
    }
    return role;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  editRole(user: User, userInfo: UserInfo): void {
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      width: '450px',
      data: { user: user,
              userInfo: userInfo}
    });

    if (this.auth.user && this.auth.user.role === "ROLE_ADMIN") {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          user.role = result;
          // Then, call the service method to update the backend
          this.us.changeRoleOfUser(user).subscribe(response => {
            if (response.success) {
              // Role successfully updated in the backend
              this.snackBar.open(response.message, 'Close', { duration: 3000 });  // <-- Snackbar for success
            } else {
              // Failed to update role in the backend
              this.snackBar.open('Failed to change role: ' + response.message, 'Close', { duration: 3000 });  // <-- Snackbar for failure
            }
          }, error => {
            // Error handling for HTTP failures
            this.snackBar.open('Could not change role due to a network error. Please try again later.', 'Close', { duration: 3000 });
          });
        }
      });
    } else {
      // If the current user is not an admin, show a message
      this.snackBar.open('Only administrators can change user roles.', 'Close', { duration: 3000 });
    }
  }


  toggleUserActivation(user: User) {
    if(user.status === 'Deactivated') {
      this.activateUser(user);
    } else {
      this.deactivateUser(user);
    }
  }


  deactivateUser(user: User) {
    if (this.auth.user && this.auth.user.role === "ROLE_ADMIN") {
      // Then, call the service method to update the backend
      this.us.deactivateUser(user).subscribe(response => {
        if (response.success) {
          // Role successfully updated in the backend
          user.status = 'Deactivated';
          this.snackBar.open(response.message, 'Close', { duration: 3000 });  // <-- Snackbar for success
        } else {
          // Failed to update role in the backend
          this.snackBar.open('Failed to deactivate user: ' + response.message, 'Close', { duration: 3000 });  // <-- Snackbar for failure
        }
      }, error => {
        // Error handling for HTTP failures
        this.snackBar.open('Could not deactivate user due to a network error. Please try again later.', 'Close', { duration: 3000 });
      });
    } else {
      // If the current user is not an admin, show a message
      this.snackBar.open('Only administrators can deactivate user.', 'Close', { duration: 3000 });
    }
  }


  activateUser(user: User) {
    if (this.auth.user && this.auth.user.role === "ROLE_ADMIN") {
      // Then, call the service method to update the backend
      this.us.activateUser(user).subscribe(response => {
        if (response.success) {
          user.status = 'Active';
          // Role successfully updated in the backend
          this.snackBar.open(response.message, 'Close', { duration: 3000 });  // <-- Snackbar for success
        } else {
          // Failed to update role in the backend
          this.snackBar.open('Failed to activate user: ' + response.message, 'Close', { duration: 3000 });  // <-- Snackbar for failure
        }
      }, error => {
        // Error handling for HTTP failures
        this.snackBar.open('Could not activate user due to a network error. Please try again later.', 'Close', { duration: 3000 });
      });
    } else {
      // If the current user is not an admin, show a message
      this.snackBar.open('Only administrators can activate user.', 'Close', { duration: 3000 });
    }
  }







}
