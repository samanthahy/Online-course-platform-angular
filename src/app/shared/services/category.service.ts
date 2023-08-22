import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Course} from "../models/course";
import {environment} from "../../../environments/environment.development";
import {Category} from "../models/category";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: Category[] | undefined;

  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]> (`${environment.api}/categories`);
  }
}
