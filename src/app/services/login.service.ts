import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  login(params: { email: any; password: any }): Observable<any> {
    return this.http.post('http://localhost:8000/path_to_login', params);
  }
}
