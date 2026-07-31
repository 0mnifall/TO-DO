import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthRegisterRequest, AuthLoginRequest, UserStatus } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly isAuthenticated = signal(false);
  readonly userName = signal<string | null>(null);

  register(username: string, email: string, password: string): Observable<void> {
    const request: AuthRegisterRequest = { username, email, password };
    return this.http.post<void>('/api/auth/register', request);
  }

  login(email: string, password: string): Observable<void> {
    const request: AuthLoginRequest = { email, password };

    return this.http
      .post('/api/auth/login', request, { responseType: 'text' })
      .pipe(
        switchMap(() => this.getUserStatus()),
        map(() => undefined)
      );
  }

  registerAndLogin(username: string, email: string, password: string): Observable<void> {
    return this.register(username, email, password).pipe(
      switchMap(() => this.login(email, password))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(
      finalize(() => this.clearUser())
    );
  }

  getUserStatus(): Observable<UserStatus> {
    return this.http.get<UserStatus>('/api/auth/user').pipe(
      tap(status => {
        this.isAuthenticated.set(status.isAuthenticated);
        this.userName.set(status.isAuthenticated ? status.username : null);
      }),
      catchError(error => {
        this.clearUser();
        return throwError(() => error);
      })
    );
  }

  private clearUser(): void {
    this.isAuthenticated.set(false);
    this.userName.set(null);
  }
}
