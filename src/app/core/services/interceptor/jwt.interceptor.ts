import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../authentication.service";
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.authenticationService.currentUserValue;
    const token = localStorage.getItem('jwt_token');

      // if (currentUser && currentUser.token && token && !this.jwtHelper.isTokenExpired(token)) {
    if(token){
      // console.log(token)
      // localStorage.removeItem('jwt_token');

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.access}`,
        },
      });
    }

    return next.handle(request);
  }
}
