import { Injectable } from '@angular/core';
import { HttpWrapper } from '../helpers/http-wrapper';
import { Observable } from 'rxjs';
import { IEvent } from '../models/event.model';

@Injectable()
export class TimelinesService {
  constructor(private httpWrapper: HttpWrapper) {}

  add(timeline: {}): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/timelines`, timeline, this.httpWrapper.getAuthOptions());
  }

  getAll(date: Date, filter: {}): Observable<any> {
    return this.httpWrapper.get(`http://localhost:8000/api/v1/timelines`, {
      params: { date, ...filter },
      ...this.httpWrapper.getAuthOptions()
    });
  }

  delete(timelineId: string | number | undefined): Observable<any> {
    return this.httpWrapper.delete(`http://localhost:8000/api/v1/timelines/${timelineId}`, this.httpWrapper.getAuthOptions());
  }

  update(params: { id: number }): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/timelines/${params.id}`, params, this.httpWrapper.getAuthOptions());
  }

  delete_selected(timelines: IEvent[]): Observable<any> {
    return this.httpWrapper.post(
      `http://localhost:8000/api/v1/timelines/destroy_selected`,
      { timelines },
      this.httpWrapper.getAuthOptions()
    );
  }
}
