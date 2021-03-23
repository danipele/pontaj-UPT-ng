import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '../helpers/http-options';
import { Observable } from 'rxjs';

@Injectable()
export class TimelinesService {
  constructor(private http: HttpClient, private httpOptions: HttpOptions) {}

  add(timeline: {}): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/timelines', timeline, this.httpOptions.getAuthOptions());
  }

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/timelines', this.httpOptions.getAuthOptions());
  }
}
