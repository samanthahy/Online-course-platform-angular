import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, timeout} from "rxjs";

export class TimeoutInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get('timeout') || 300000;  // set default value here
    return next.handle(req).pipe(timeout(Number(timeoutValue)));
  }
}
