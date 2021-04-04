import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWrapper } from '../helpers/http-wrapper';

@Injectable()
export class UserService {
  constructor(private httpWrapper: HttpWrapper) {}

  resetPassword(email: string): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/users/reset_password`, { email }, this.httpWrapper.getAuthOptions());
  }

  getAuthenticatedUser(): Observable<any> {
    return this.httpWrapper.get(`http://localhost:8000/api/v1/users/authenticated_user`, this.httpWrapper.getAuthOptions());
  }

  updateCurrentUser(params: {}): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/users`, { user: params }, this.httpWrapper.getAuthOptions());
  }
}
