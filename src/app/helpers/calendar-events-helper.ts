import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { TimelinesService } from '../services/timelines.service';
import { map } from 'rxjs/operators';
import { IEvent } from '../models/event.model';

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
    const ev: IEvent = {
      id: 1,
      start: new Date(timeline.start_date),
      end: new Date(timeline.end_date),
      title: timeline.subactivity,
      color: {
        primary: '#00135f',
        secondary: this.getEventColor(timeline.activity)
      },
      description: timeline.description,
      activity: timeline.activity,
      subactivity: timeline.subactivity
    };

    if (timeline.course) {
      ev.entity = timeline.course;
    } else if (timeline.project) {
      ev.entity = timeline.project;
    }

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

  getEventColor(activity: string): string {
    switch (activity) {
      case 'Curs':
        return 'rgb(255, 20, 20, 0.5)';
      case 'Project':
        return 'rgb(20, 255, 20, 0.5)';
      case 'Alta activitate':
        return 'rgb(20, 20, 200, 0.5)';
      case 'Concediu':
        return 'rgb(209, 214, 100, 0.5)';
    }
    return '';
  }
}
