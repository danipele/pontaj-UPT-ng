import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions } from '../helpers/http-options';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private httpOptions: HttpOptions) {}

  resetPassword(email: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/users/reset_password', { email }, this.httpOptions.getAuthOptions());
  }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/users/authenticated_user', this.httpOptions.getAuthOptions());
  }

  updateCurrentUser(params: {}): Observable<any> {
    return this.http.put(`http://localhost:8000/api/v1/users`, { user: params }, this.httpOptions.getAuthOptions());
  }
}
