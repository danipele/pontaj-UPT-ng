import { Injectable } from '@angular/core';
import { EventService } from '../services/event.service';
import { map } from 'rxjs/operators';
import { IEvent } from '../models/event.model';
import { indexOf } from 'lodash';
import { AddEventDialogComponent } from '../dialogs/add-event-dialog/add-event-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class CalendarEventsHelper {
  events: IEvent[] = [];

  constructor(public dialog: MatDialog, private eventService: EventService) {}

  resolveEvent(result: any): void {
    const startDate = new Date(result.date);
    const endDate = new Date(result.date);
    startDate.setHours(result.startHour);
    endDate.setHours(result.endHour);

    const event: any = {
      start_date: startDate,
      end_date: endDate,
      activity: result.activity,
      subactivity: result.subactivity,
      entity: result.entity ? result.entity.id : undefined,
      description: result.description
    };

    if (result.id) {
      event.id = result.id;
      this.eventService.update(event).subscribe((eventResult: {}) => {
        this.editEvent(eventResult);
      });
    } else {
      this.eventService.add(event).subscribe((eventResult: {}) => {
        this.addEvent(eventResult);
      });
    }
  }

  createEvent(event: any): IEvent {
    return {
      id: event.id,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      title: event.subactivity,
      color: {
        primary: '#fff',
        secondary: this.getEventColor(event.activity)
      },
      description: event.description,
      activity: event.activity,
      subactivity: event.subactivity,
      entity: event.entity
    };
  }

  addEvent(event: any): void {
    const calendarEvent = this.createEvent(event);
    this.events.push(calendarEvent);
  }

  editEvent(event: any): void {
    const ev = this.createEvent(event);
    for (const calendarEvent of this.events) {
      if (calendarEvent.id === ev.id) {
        const index = indexOf(this.events, calendarEvent);
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
      course?: number;
      project?: number;
    }
  ): Promise<IEvent[]> {
    return this.eventService
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
      course?: number;
      project?: number;
    }
  ): Promise<IEvent[]> {
    return this.eventService
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
    result.forEach((event) => {
      this.addEvent(event);
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
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
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
        message: 'Esti sigur ca vrei sa stergi aceasta evenimente?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.eventService.delete(event.id).subscribe(() => {
          this.deleteEvent(event);
        });
      }
    });
  }
}
