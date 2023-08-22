import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {User} from "../models/user";
import {Page} from "../models/page";

const API_URL = 'http://localhost:8080/test/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


interface UserOperationResponse {
  success: boolean;
  statusCode: number;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {


constructor(private httpClient: HttpClient) { }


/*
  addRoleToUser(roleData: {role: string}): Observable<{success: boolean}> {
    return this.httpClient.post<{success: boolean}>(`${environment.api}/users/add-role`, roleData, httpOptions);
  }*/

  getUserById(id: number) : Observable<User> {
    return this.httpClient.get<User>(`${environment.api}/users/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError('Error fetching user');
      })
    );
  }



  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.api}/users`)
  }


  changeToInstructorRole(role: string): Observable<{success: boolean}> {
    return this.httpClient.post<{success: boolean}>(`${environment.api}/users/change-to-instructor`, role, httpOptions);
  }



  changeRoleOfUser(user: User): Observable<UserOperationResponse> {
    return this.httpClient.post<UserOperationResponse>(`${environment.api}/users/change-role`, user, httpOptions);
  }



  getUsersWithFilterSortPaginator(sort: string, order: string, page: number, size: number, filter: string): Observable<Page<User>> {
    return this.httpClient.get<Page<User>>(`${environment.api}/users?sort=${sort}&order=${order}&page=${page}&size=${size}${filter ? '&filter=' + filter : ''}`);
  }



  deactivateUser(user: User): Observable<UserOperationResponse> {
    return this.httpClient.put<UserOperationResponse>(`${environment.api}/users/deactivate-user`, user, httpOptions);
  }


  activateUser(user: User): Observable<UserOperationResponse> {
    return this.httpClient.put<UserOperationResponse>(`${environment.api}/users/activate-user`, user, httpOptions);
  }

}
