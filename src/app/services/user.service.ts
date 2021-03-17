import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getAuthenticatedUser(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/users/authenticated_user');
  }
}
