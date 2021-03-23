import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { TimelinesService } from '../services/timelines.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CalendarEventsHelper {
  events: CalendarEvent[] = [];

  constructor(private timelineService: TimelinesService) {}

  resolveEvent(result: any): void {
    const startDate = new Date(result.date);
    const endDate = new Date(result.date);
    startDate.setHours(result.startHour);
    endDate.setHours(result.endHour);

    const timeline: {} = {
      start_date: startDate,
      end_date: endDate,
      activity: result.activity,
      subactivity: result.subactivity,
      entity: result.entity ? result.entity.id : undefined,
      description: result.description
    };

    this.timelineService.add(timeline).subscribe((timelineResult: {}) => {
      this.addEvent(timelineResult);
    });
  }

  addEvent(timeline: any): void {
    const ev = {
      id: 1,
      start: new Date(timeline.start_date),
      end: new Date(timeline.end_date),
      title: timeline.activity_type,
      color: {
        primary: '#00135f',
        secondary: '#fff'
      }
    };

    this.events.push(ev);
  }

  getUserEventsForCurrentWeek(date: Date): Promise<CalendarEvent[]> {
    return this.timelineService
      .getAllForWeek(date)
      .pipe(
        map((result: []) => {
          return this.addEvents(result);
        })
      )
      .toPromise();
  }

  getUserEventsForCurrentDay(date: Date): Promise<CalendarEvent[]> {
    return this.timelineService
      .getAllForDay(date)
      .pipe(
        map((result: []) => {
          return this.addEvents(result);
        })
      )
      .toPromise();
  }

  addEvents(result: []): CalendarEvent[] {
    this.events = [];
    result.forEach((timeline) => {
      this.addEvent(timeline);
    });
    return this.getEvents();
  }

  getEvents(): CalendarEvent[] {
    return this.events;
  }

  deleteEvents(): void {
    this.events = [];
  }
}
