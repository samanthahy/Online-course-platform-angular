import {Injectable} from "@angular/core";
import {User} from "../models/user";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut() {
    console.log('clear start...');
    window.sessionStorage.clear();
    console.log(sessionStorage);
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    const item = sessionStorage.getItem(TOKEN_KEY);
    return item !== null ? item : '';
  }

  public saveUser(user: User) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() : User {
    const item = window.sessionStorage.getItem(USER_KEY);
    return item !== null ? JSON.parse(item) : null;
  }
}
