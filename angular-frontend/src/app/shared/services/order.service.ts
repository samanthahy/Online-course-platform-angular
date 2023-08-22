import { Injectable } from '@angular/core';
import {ShoppingSession} from "../models/shopping-session";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {Order} from "../models/order";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Page} from "../models/page";
import {User} from "../models/user";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient,
              private auth: AuthService) { }


  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${environment.api}/orders`);
  }



/*  createOrder(): Observable<Order> {
    if (this.auth.user) {
      const user = this.auth.user;
      return this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`).pipe(
        switchMap(shoppingSession => {
          console.log(shoppingSession);
          return this.httpClient.post<Order>(`${environment.api}/orders/sessionId/${shoppingSession.id}`, {},{responseType: 'json'});
        }),
        catchError(error => {
          console.error('Error creating order', error);
          return throwError(error);
        })
      );
    } else {
      return throwError('User not authenticated');
    }
  }*/


  createOrder(paymentType: string): Observable<Order> {
    if (this.auth.user) {
      const user = this.auth.user;
      return this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`).pipe(
        switchMap(shoppingSession => {
          console.log(shoppingSession);
          const orderCreationRequest = {
            sessionId: shoppingSession.id,
            paymentType: paymentType
          };
          return this.httpClient.post<Order>(`${environment.api}/orders`, orderCreationRequest, {responseType: 'json'});
        }),
        catchError(error => {
          console.error('Error creating order', error);
          return throwError(error);
        })
      );
    } else {
      return throwError('User not authenticated');
    }
  }



  getOrderById(orderId: number) : Observable<Order> {
    return this.httpClient.get<Order>(`${environment.api}/orders/${orderId}`);
  }


  getOrdersWithFilterSortPaginator(sort: string, order: string, page: number, size: number, filter: string): Observable<Page<Order>> {
    return this.httpClient.get<Page<Order>>(`${environment.api}/orders?sort=${sort}&order=${order}&page=${page}&size=${size}${filter ? '&filter=' + filter : ''}`);
  }



  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${environment.api}/orders/userId/${userId}`);
  }

}
