import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class HttpWrapper {
  constructor(private cookieService: CookieService, private router: Router, private http: HttpClient) {}

  getAuthOptions(): { headers: {} } {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.cookieService.get('auth_token')}`
    });

    return { headers };
  }

  getImportOptions(): { headers: {} } {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookieService.get('auth_token')}`
    });

    return { headers };
  }

  getDownloadOptions(): { headers: {}; responseType: any } {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookieService.get('auth_token')}`
    });

    return { headers, responseType: 'blob' };
  }

  handleHttpErrors(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/login']);
    }
    return throwError(error);
  }

  post(url: string, params: {}, options: {}): Observable<any> {
    return this.http.post(url, params, options).pipe(
      map((result: any) => result),
      catchError((error) => this.handleHttpErrors(error))
    );
  }

  get(url: string, options: {}): Observable<any> {
    return this.http.get(url, options).pipe(
      map((result: any) => result),
      catchError((error) => this.handleHttpErrors(error))
    );
  }

  put(url: string, params: {}, options: {}): Observable<any> {
    return this.http.put(url, params, options).pipe(
      map((result: any) => result),
      catchError((error) => this.handleHttpErrors(error))
    );
  }

  delete(url: string, options: {}): Observable<any> {
    return this.http.delete(url, options).pipe(
      map((result: any) => result),
      catchError((error) => this.handleHttpErrors(error))
    );
  }
}
