import { Injectable } from '@angular/core';
import { TimelinesService } from '../services/timelines.service';
import { map } from 'rxjs/operators';
import { IEvent } from '../models/event.model';
import { indexOf } from 'lodash';
import { AddTimelineDialogComponent } from '../dialogs/add-timeline-dialog/add-timeline-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class CalendarEventsHelper {
  events: IEvent[] = [];

  constructor(public dialog: MatDialog, private timelineService: TimelinesService) {}

  resolveEvent(result: any): void {
    const startDate = new Date(result.date);
    const endDate = new Date(result.date);
    startDate.setHours(result.startHour);
    endDate.setHours(result.endHour);

    const timeline: any = {
      start_date: startDate,
      end_date: endDate,
      activity: result.activity,
      subactivity: result.subactivity,
      entity: result.entity ? result.entity.id : undefined,
      description: result.description
    };

    if (result.id) {
      timeline.id = result.id;
      this.timelineService.update(timeline).subscribe((timelineResult: {}) => {
        this.editEvent(timelineResult);
      });
    } else {
      this.timelineService.add(timeline).subscribe((timelineResult: {}) => {
        this.addEvent(timelineResult);
      });
    }
  }

  createEvent(timeline: any): IEvent {
    return {
      id: timeline.id,
      start: new Date(timeline.start_date),
      end: new Date(timeline.end_date),
      title: timeline.subactivity,
      color: {
        primary: '#fff',
        secondary: this.getEventColor(timeline.activity)
      },
      description: timeline.description,
      activity: timeline.activity,
      subactivity: timeline.subactivity,
      entity: timeline.entity
    };
  }

  addEvent(timeline: any): void {
    const event = this.createEvent(timeline);
    this.events.push(event);
  }

  editEvent(timeline: any): void {
    const ev = this.createEvent(timeline);
    for (const event of this.events) {
      if (event.id === ev.id) {
        const index = indexOf(this.events, event);
        if (index !== -1) {
          this.events.splice(index, 1, ev);
        }
        break;
      }
    }
  }

  getUserEventsForCurrentWeek(
    date: Date,
    params?: {
      sort?: string;
      direction?: string;
      subactivity?: string;
      activity?: string;
      start_date_filter?: string;
      end_date_filter?: string;
      all?: boolean;
    }
  ): Promise<IEvent[]> {
    return this.timelineService
      .getAll(date, { for: 'week', ...params })
      .pipe(
        map((result: []) => {
          return this.addEvents(result);
        })
      )
      .toPromise();
  }

  getUserEventsForCurrentDay(
    date: Date,
    params?: {
      sort?: string;
      direction?: string;
      subactivity?: string;
      activity?: string;
      start_date_filter?: string;
      end_date_filter?: string;
      all?: boolean;
    }
  ): Promise<IEvent[]> {
    return this.timelineService
      .getAll(date, { for: 'day', ...params })
      .pipe(
        map((result: []) => {
          return this.addEvents(result);
        })
      )
      .toPromise();
  }

  addEvents(result: []): IEvent[] {
    this.events = [];
    result.forEach((timeline) => {
      this.addEvent(timeline);
    });
    return this.getEvents();
  }

  getEvents(): IEvent[] {
    return this.events;
  }

  deleteEvents(): void {
    this.events = [];
  }

  getEventColor(activity: string): string {
    switch (activity) {
      case 'Activitate didactica':
        return 'rgb(183, 4, 4)';
      case 'Proiect':
        return 'rgb(29, 119, 29)';
      case 'Alta activitate':
        return 'rgb(51, 195, 178)';
      case 'Concediu':
        return 'rgb(90, 37, 236)';
    }
    return '';
  }

  deleteEvent(event: IEvent): void {
    const index = indexOf(this.events, event);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  editEventAction(event: IEvent): void {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '40%',
      data: {
        event
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resolveEvent(result);
      }
    });
  }

  deleteEventAction(event: IEvent): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Esti sigur ca vrei sa stergi aceasta inregistrare?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.timelineService.delete(event.id).subscribe(() => {
          this.deleteEvent(event);
        });
      }
    });
  }
}
