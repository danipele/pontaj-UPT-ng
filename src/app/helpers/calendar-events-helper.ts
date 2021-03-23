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
      all_day: result.allDay,
      activity: result.activity,
      subactivity: result.subactivity,
      entity: result.entity,
      description: result.description
    };

    this.timelineService.add(timeline).subscribe(() => {
      this.addEvent(startDate, endDate, result.allDay);
    });
  }

  addEvent(startDate: Date, endDate: Date, allDay: boolean): void {
    const ev = {
      id: 1,
      start: startDate,
      end: endDate,
      title: 'This is an event',
      color: {
        primary: '#00135f',
        secondary: '#5e5d5b'
      },
      allDay
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
    result.forEach((timeline: { start_date: string; end_date: string; all_day: boolean }) => {
      this.addEvent(new Date(timeline.start_date), new Date(timeline.end_date), timeline.all_day);
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
