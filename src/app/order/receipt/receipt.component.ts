import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {OrderService} from "../../shared/services/order.service";
import {Order} from "../../shared/models/order";
import {switchMap} from "rxjs";
import {UserInfo} from "../../shared/models/user-info";
import {UserInfoService} from "../../shared/services/user-info.service";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  order?: Order;
  userInfo: UserInfo;
  constructor(private ar: ActivatedRoute,
              private os: OrderService,
              private uis: UserInfoService) { }

  ngOnInit(): void {
    this.ar.paramMap.pipe(
      // Step 1: Extract orderId from route parameters
      switchMap((params: ParamMap) => {
        const orderId = +params.get('orderId')!;
        // Step 2: Get the Order object using orderId
        return this.os.getOrderById(orderId);
      }),
      switchMap((order: Order) => {
        this.order = order;
        // Step 3: Get the UserInfo object using userId from the order
        return this.uis.getUserInfoByUserId(order.userId);
      })
    ).subscribe((userInfo: UserInfo) => {
      this.userInfo = userInfo;
    }, error => {
      console.error("Failed to fetch data", error);
    });
  }
}

