import { Injectable } from '@angular/core';
import { HttpWrapper } from '../helpers/http-wrapper';
import { Observable } from 'rxjs';

@Injectable()
export class TimelinesService {
  constructor(private httpWrapper: HttpWrapper) {}

  add(timeline: {}): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/timelines`, timeline, this.httpWrapper.getAuthOptions());
  }

  getAllForWeek(date: Date): Observable<any> {
    return this.httpWrapper.post(
      `http://localhost:8000/api/v1/timelines/for_week`,
      { date: date.toDateString() },
      this.httpWrapper.getAuthOptions()
    );
  }

  getAllForDay(date: Date): Observable<any> {
    return this.httpWrapper.post(
      `http://localhost:8000/api/v1/timelines/for_day`,
      { date: date.toDateString() },
      this.httpWrapper.getAuthOptions()
    );
  }

  delete(timelineId: string | number | undefined): Observable<any> {
    return this.httpWrapper.delete(`http://localhost:8000/api/v1/timelines/${timelineId}`, this.httpWrapper.getAuthOptions());
  }

  update(params: { id: number }): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/timelines/${params.id}`, params, this.httpWrapper.getAuthOptions());
  }
}
