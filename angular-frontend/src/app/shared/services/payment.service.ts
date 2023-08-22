import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Payment} from "../models/payment";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) { }

  storeCardDetails(payment: Payment): Observable<Payment> {
    return this.httpClient.post<Payment>(`${environment.api}/payments`, payment);
  }
}
