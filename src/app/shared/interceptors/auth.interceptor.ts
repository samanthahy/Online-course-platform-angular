import {Injectable} from "@angular/core";
import {HttpRequest, HttpEvent, HttpHandler, HttpInterceptor} from "@angular/common/http";
import {Observable} from "rxjs";
import {TokenStorageService} from "../services/token-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenStorage: TokenStorageService) {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getToken();
    if (token) {
      req = req.clone( {
        // Authorization: "Bearer token"
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
