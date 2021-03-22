import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions } from '../helpers/http-options';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private httpOptions: HttpOptions) {}

  login(params: {}): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/login', { session: params });
  }

  logout(): Observable<any> {
    return this.http.delete('http://localhost:8000/api/v1/logout', this.httpOptions.getAuthOptions());
  }

  signup(params: {}): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/users', { user: params });
  }
}
