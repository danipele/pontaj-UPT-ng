import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  login(params: {}): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/users/login', { user: params });
  }

  logout(): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/users/logout', {});
  }
}
