import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpWrapper } from '../helpers/http-wrapper';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private httpWrapper: HttpWrapper) {}

  login(params: {}): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/login`, { session: params });
  }

  logout(): Observable<any> {
    return this.httpWrapper.delete(`http://localhost:8000/api/v1/logout`, this.httpWrapper.getAuthOptions());
  }

  signup(params: {}): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/users`, { user: params });
  }
}
