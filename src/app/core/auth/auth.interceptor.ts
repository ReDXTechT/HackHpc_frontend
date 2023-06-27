import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, throwError } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const authService = inject(AuthenticationService);
    const token = localStorage.getItem('jwt_token')

    // Clone the request object
    let newReq = req.clone();
    if ( token && !AuthUtils.isTokenExpired(token) )
    {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token ),
        });
    }

    // Response
    return next(newReq).pipe(
        catchError((error) =>
        {
            console.log("***********************",error)
            // Catch "401 Unauthorized" responses
            if ( error instanceof HttpErrorResponse && error.status === 401 )
            {
                // Sign out
                authService.logout();

                // Reload the app
                location.reload();
            }

            return throwError(error);
        }),
    );
};
