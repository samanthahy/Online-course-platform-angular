import {EventEmitter, Injectable, NgModule} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {User} from "../models/user";
import {TokenStorageService} from "./token-storage.service";
import {Router} from "@angular/router";
import {CartService} from "./cart.service";



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  userDTO: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user : User | null = null;

  public userLoggedOut = new EventEmitter<void>();

  // Expose the user$ observable to allow other parts of the app to react to login events
  get user$() {
    return this.userSubject.asObservable();
  }



  constructor(
    private  httpClient: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router) {
  }

  public updateUser(updatedUser: User) {
    this.user = updatedUser;
    this.userSubject.next(updatedUser);
  }




  login(user: {username: string, password: string}): Observable<LoginResponse> {
    return this.httpClient.post< LoginResponse > (`${environment.api}/auth/login`, user, httpOptions)
      .pipe(
        tap(response => {
          // If login is successful, update the user information and emit it via the user$ observable
          if (response.success && response.userDTO) {
            this.updateUser(response.userDTO);
            // console.log(this.user.wishlistCourses);
            this.tokenStorage.saveToken(response.token);
            this.tokenStorage.saveUser(response.userDTO);
          }
        }),
        catchError(err => {
          // If an error is thrown, capture the error message and throw it
          let errorMessage = 'An unknown error occurred!';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }
          return throwError(errorMessage);
        })
      );
  }


  register(registerData: {fullname: string, username: string, email: string, password: string, role: string}): Observable<{success: boolean}> {
    const registerRequest = {
      fullname: registerData.fullname,
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role
    };
    return this.httpClient.post<{success: boolean}>(`${environment.api}/users/register`, registerRequest, httpOptions);
  }

  logout() {
    this.tokenStorage.signOut();
    this.user = null;
    this.userLoggedOut.emit();  // Emit the event when user logs out
    this.router.navigate(['/home']);
  }
}



