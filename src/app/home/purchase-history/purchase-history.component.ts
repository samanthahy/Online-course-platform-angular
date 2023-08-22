import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Order} from "../../shared/models/order";
import {OrderService} from "../../shared/services/order.service";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../shared/services/user.service";
import {UserInfoService} from "../../shared/services/user-info.service";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit{

  orders : Order[] = [];
  displayedColumns: string[] = [ 'courses', 'purchaseDate', 'total','paymentType', 'menu'];

  constructor(private orderService: OrderService,
              private httpClient: HttpClient,
              private datePipe: DatePipe,
              private router: Router,
              private auth: AuthService) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.orderService.getOrdersByUser(this.auth.user.id).subscribe(orders => {
        this.orders = orders;
      }, error => {
        console.error('Error fetching orders:', error);
      });
    }
  }



  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }


  checkReceipt(orderId: number): void {
    this.router.navigate(['/receipt', orderId]); // redirect to receipt page
  }
}
