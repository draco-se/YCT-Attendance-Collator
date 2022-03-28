import { environment } from 'src/environments/environment';
import { take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (
          user &&
          req.url.includes(environment.restApiAddress + '/create-record')
        ) {
          const modifiedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`,
              Accept: '*/*',
            },
          });
          return next.handle(modifiedReq);
        } else {
          return next.handle(req);
        }
      }),
    );
  }
}
