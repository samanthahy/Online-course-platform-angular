import {Component, OnInit} from '@angular/core';
import {CartService} from "./shared/services/cart.service";
import {TokenStorageService} from "./shared/services/token-storage.service";
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'OnlineCoursePlatformFrontend';

  constructor(private cartService: CartService,
              private auth: AuthService,
              private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    const user = this.tokenStorage.getUser();

    if (token && user) {
      this.auth.updateUser(user);
      this.cartService.initializeCartCount();
    }

  }
}
