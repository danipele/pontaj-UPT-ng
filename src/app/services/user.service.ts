import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWrapper } from '../helpers/http-wrapper';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private httpWrapper: HttpWrapper, private http: HttpClient) {}

  resetPassword(email: string): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/users/reset_password`, { email }, this.httpWrapper.getAuthOptions());
  }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get(`http://localhost:8000/api/v1/users/authenticated_user`, this.httpWrapper.getAuthOptions());
  }

  updateCurrentUser(params: {}): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/users`, { user: params }, this.httpWrapper.getAuthOptions());
  }
}
