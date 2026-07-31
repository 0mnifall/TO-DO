import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { API_BASE_URL, buildApiUrl } from '../../api.config';

let refreshInProgress = false;
const refreshResult = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const http = inject(HttpClient);
  const apiBaseUrl = inject(API_BASE_URL);

  const authReq = req.clone({
    url: buildApiUrl(req.url, apiBaseUrl),
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || authReq.url.includes('/api/auth/login') || authReq.url.includes('/api/auth/refresh')) {
        return throwError(() => error);
      }

      if (refreshInProgress) {
        return refreshResult.pipe(
          filter((result): result is boolean => result !== null),
          take(1),
          switchMap(success => {
            if (success) {
              return next(authReq);
            }

            return throwError(() => error);
          })
        );
      }

      refreshInProgress = true;
      refreshResult.next(null);

      return http
        .post<void>(buildApiUrl('/api/auth/refresh', apiBaseUrl), {}, { withCredentials: true })
        .pipe(
          switchMap(() => {
            refreshInProgress = false;
            refreshResult.next(true);
            return next(authReq);
          }),
          catchError(refreshError => {
            refreshInProgress = false;
            refreshResult.next(false);
            return throwError(() => refreshError);
          })
        );
    })
  );
};
