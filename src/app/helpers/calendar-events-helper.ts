import { Injectable } from '@angular/core';
import { EventService } from '../services/event.service';
import { map } from 'rxjs/operators';
import { IEvent } from '../models/event.model';
import { indexOf } from 'lodash';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationHelper } from './notification-helper';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CalendarEventsHelper {
  events: IEvent[] = [];

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService
  ) {}

  resolveEvent(result: any, date: Date, filterParams: any): Promise<{ events: IEvent[]; mode: string; successfully?: number }> {
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
      description: result.description,
      type: result.type
    };
    let params: any = {
      ...event,
      filter: {
        date,
        ...filterParams
      }
    };

    if (result.id) {
      params.id = result.id;
      return this.eventService
        .update(params)
        .pipe(
          map((eventsResult: any) => {
            if (eventsResult.successfully) {
              return { events: this.addEvents(eventsResult.events), mode: 'edit', successfully: eventsResult.successfully };
            } else {
              return { events: this.addEvents(eventsResult), mode: 'edit' };
            }
          })
        )
        .toPromise();
    } else {
      params = {
        ...params,
        recurrent: result.recurrent,
        recurrent_date: result.recurrentDate,
        weekends_too: result.weekendsToo
      };
      return this.eventService
        .add(params)
        .pipe(
          map((eventsResult: any) => {
            if (eventsResult.successfully) {
              return { events: this.addEvents(eventsResult.events), mode: 'add', successfully: eventsResult.successfully };
            } else {
              return { events: this.addEvents(eventsResult), mode: 'add' };
            }
          })
        )
        .toPromise();
    }
  }

  createEvent(event: any): IEvent {
    return {
      id: event.id,
      start: new Date(event.start_date),
      end: event.activity === 'holidays' ? new Date(event.start_date) : new Date(event.end_date),
      title: event.subactivity,
      color: {
        primary: '#fff',
        secondary: this.getEventColor(event.activity || 'project')
      },
      description: event.description,
      activity: event.activity || 'project',
      subactivity: event.subactivity,
      entity: event.entity,
      type: event.type,
      allDay: event.activity === 'holidays'
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
      course?: string;
      project?: string;
      for?: string;
    }
  ): Promise<IEvent[]> {
    return this.eventService
      .getAll(date, params)
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
      course?: string;
      project?: string;
      for?: string;
    }
  ): Promise<IEvent[]> {
    return this.eventService
      .getAll(date, params)
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
      case 'courseHour':
        return 'rgb(183, 4, 4)';
      case 'project':
        return 'rgb(29, 119, 29)';
      case 'otherActivity':
        return 'rgb(51, 195, 178)';
      case 'holidays':
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

  deleteEventAction(event: IEvent): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: this.translateService.instant('message.deleteConfirmation', {
          objectType: this.translateService.instant('message.event')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.eventService.delete(event.id).subscribe(
          () => {
            this.deleteEvent(event);
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.event'),
                action: this.translateService.instant('message.sg.deleted')
              }),
              'success'
            );
          },
          (error) => this.notificationHelper.notifyWithError(error)
        );
      }
    });
  }
}
