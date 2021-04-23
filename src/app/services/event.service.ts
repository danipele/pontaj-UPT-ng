import { Injectable } from '@angular/core';
import { HttpWrapper } from '../helpers/http-wrapper';
import { Observable } from 'rxjs';
import { IEvent } from '../models/event.model';

@Injectable()
export class EventService {
  constructor(private httpWrapper: HttpWrapper) {}

  add(event: {}): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/events`, event, this.httpWrapper.getAuthOptions());
  }

  getAll(date: Date, filter?: {}): Observable<any> {
    return this.httpWrapper.get(`http://localhost:8000/api/v1/events`, {
      params: { date, ...filter },
      ...this.httpWrapper.getAuthOptions()
    });
  }

  delete(eventId: string | number | undefined): Observable<any> {
    return this.httpWrapper.delete(`http://localhost:8000/api/v1/events/${eventId}`, this.httpWrapper.getAuthOptions());
  }

  update(params: { id: number }): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/events/${params.id}`, params, this.httpWrapper.getAuthOptions());
  }

  deleteSelected(events: IEvent[]): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/events/destroy_selected`, { events }, this.httpWrapper.getAuthOptions());
  }

  copyEvents(params: {}): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/events/copy_events`, params, this.httpWrapper.getAuthOptions());
  }

  copyEvent(params: {}): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/events/copy_event`, params, this.httpWrapper.getAuthOptions());
  }
}
