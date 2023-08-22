import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService, LoginResponse} from "../../shared/services/auth.service";
import {TokenStorageService} from "../../shared/services/token-storage.service";
import {CartService} from "../../shared/services/cart.service";
import {finalize, tap} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  user: object | null = null;
  // roles: string[] = [];
  errorMessage: string = '';


  constructor(
    public auth: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private cartService: CartService
  ) {
/*    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/home']).catch(error => console.log(error));
    }*/
  }


  login( {value}: NgForm): void {
    this.auth.login(value)
      .subscribe(
        (res: LoginResponse) => {
          if (res.success) {
            console.log('login succeed');
            this.errorMessage = '';

            // After successful login, merge local cart with backend
            this.cartService.mergeLocalCartWithBackend().pipe(
              finalize(() => {
                this.cartService.initializeCartCount();
              })
            ).subscribe(
              () => {
              },
              (error) => {
                console.error("Error merging local cart with backend:", error);
              },
              () => {
                const returnUrl = localStorage.getItem('returnUrl') || '/home';
                localStorage.removeItem('returnUrl');

                setTimeout(() => {
                  this.router.navigateByUrl(returnUrl).catch(error => console.log(error))
                }, 3000);
              }
            );
          } else {
            console.log('login failed');
            this.errorMessage = res.message;
          }
        },
        (err) => {
          alert(err); // Handle HTTP error responses
        }
      );
  }
}
