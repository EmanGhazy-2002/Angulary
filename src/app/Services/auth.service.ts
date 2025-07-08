import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://faresapi.runasp.net/api/Account/login';
  private registerUrl = 'http://faresapi.runasp.net/api/Account/register';
  userData: any;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  login(data: { username: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.loginUrl, {
      username: data.username,
      password: data.password
    }, { headers }).pipe(
      map((response: any) => {
        return { token: response.token || 'mock-jwt-token', user: response.user || {} };
      }),
      catchError((err) => {
        console.error('Login API error:', err);
        return throwError(() => err);
      })
    );
  }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.registerUrl, {
      username: data.username,
      email: data.email,
      password: data.password
    }, { headers }).pipe(
      map((response: any) => {
        return { message: response.message || 'Registration successful', user: response.user || {} };
      }),
      catchError((err) => {
        console.error('Register API error:', err);
        return throwError(() => err);
      })
    );
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('userToken');
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userToken');
    }
    this.userData = null;
  }
}