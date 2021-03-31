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

  getAllForWeek(date: Date): Observable<any> {
    return this.http.post(
      'http://localhost:8000/api/v1/timelines/for_week',
      { date: date.toDateString() },
      this.httpOptions.getAuthOptions()
    );
  }

  getAllForDay(date: Date): Observable<any> {
    return this.http.post(
      'http://localhost:8000/api/v1/timelines/for_day',
      { date: date.toDateString() },
      this.httpOptions.getAuthOptions()
    );
  }

  delete(timelineId: string | number | undefined): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/v1/timelines/${timelineId}`, this.httpOptions.getAuthOptions());
  }

  update(params: { id: number }): Observable<any> {
    return this.http.put(`http://localhost:8000/api/v1/timelines/${params.id}`, params, this.httpOptions.getAuthOptions());
  }
}
