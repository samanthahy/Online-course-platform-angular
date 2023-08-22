import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {OrderService} from "../../shared/services/order.service";
import {Order} from "../../shared/models/order";
import {User} from "../../shared/models/user";
import {FormControl} from "@angular/forms";
import {UserInfo} from "../../shared/models/user-info";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../shared/services/user.service";
import {UserInfoService} from "../../shared/services/user-info.service";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, forkJoin, map, merge, of, startWith, switchMap, tap} from "rxjs";
import {Page} from "../../shared/models/page";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent  {
  orders : Order[] = [];
  displayedColumns: string[] = [ 'position','orderNumber','total','customer', 'purchaseDate', 'paymentType', 'menu'];
  resultsLength = 0;
  pageSize: number = 10;
  isLoadingResults = true;
  filterControl = new FormControl('');
  userInfoMap: Map<number, UserInfo> = new Map();
  userMap: Map<number, User> = new Map();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private orderService: OrderService,
              private httpClient: HttpClient,
              private us: UserService,
              private uis: UserInfoService,
              private cdr: ChangeDetectorRef,
              private datePipe: DatePipe,
              private dialog: MatDialog,
              private auth: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.filterControl.valueChanges.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.filterControl.valueChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.orderService.getOrdersWithFilterSortPaginator(
            this.sort.active || 'purchaseDate',
            this.sort.direction.toUpperCase() || 'ASC',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.filterControl.value || ''
          );
        }),
        catchError(error => {
          this.isLoadingResults = false;
          console.error("An error occurred:", error);
          // Return a default empty Page<Order> object
          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 0
          });
        }),

        switchMap((page: Page<Order>) => {
          if (page.content && page.content.length > 0) {
            return forkJoin(
              page.content.map((order: Order) =>
                forkJoin({
                  user: this.us.getUserById(order.userId).pipe(
                    tap((user: User) => {
                      this.userMap.set(order.id, user);
                    })
                  ),
                  userInfo: this.uis.getUserInfoByUserId(order.userId).pipe(
                    tap((userInfo: UserInfo) => {
                      this.userInfoMap.set(order.id, userInfo);
                    })
                  )
                })
              )
            ).pipe(
              map(() => page)
            );
          } else {
            return of(page);
          }
        }),
        tap(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe(page => {
        this.orders = page.content;
        this.resultsLength = page.totalElements;
        this.cdr.detectChanges();
      });
  }


  onPageSizeChange() {
    this.paginator.pageIndex = 0; // reset to the first page
    this.paginator._changePageSize(this.pageSize); // trigger a page change event
  }



  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }



  checkReceipt(orderId: number): void {
    this.router.navigate(['/receipt', orderId]); // redirect to receipt page
  }
}
