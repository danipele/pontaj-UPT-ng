import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from '../../dialogs/add-event-dialog/add-event-dialog.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { CookieService } from 'ngx-cookie';
import { EventDialogComponent } from '../../dialogs/event-dialog/event-dialog.component';
import { IEvent } from '../../models/event.model';
import { MatTableDataSource } from '@angular/material/table';
import { CopyEventsDialogComponent } from '../../dialogs/copy-events-dialog/copy-events-dialog.component';
import { EventService } from '../../services/event.service';
import { CopyEventDialogComponent } from '../../dialogs/copy-event-dialog/copy-event-dialog.component';
import { NotificationHelper } from '../../helpers/notification-helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {
  viewType: string;
  date: Date;
  events: IEvent[];
  viewMode: string;
  filterParams: {
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
  };

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private calendarEventsHelper: CalendarEventsHelper,
    private cookieService: CookieService,
    private eventService: EventService,
    private notificationHelper: NotificationHelper
  ) {
    this.viewType = 'Saptamanal';
    this.date = moment().startOf('week').toDate();
    this.events = [];
    this.viewMode = 'calendar';
    this.initCalendarFilters();
    this.filterParams.for = 'week';
  }

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe(
      () => {
        this.setEvents();
      },
      (error) => {
        if (error.status === 401) {
          this.calendarEventsHelper.deleteEvents();
          this.router.navigate(['/login']);
          this.notificationHelper.openNotification('Trebuie sa te loghezi pentru a intra in cont.', 'success');
        }
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  isWeekly(): boolean {
    return this.viewType === 'Saptamanal';
  }

  isDaily(): boolean {
    return this.viewType === 'Zilnic';
  }

  setWeekly(): void {
    this.viewType = 'Saptamanal';
    this.date = moment(this.date).startOf('week').toDate();
    this.filterParams.all = false;
    this.filterParams.for = 'week';
    this.setWeekEvents();
  }

  goBackwards(): void {
    const yesterday = new Date(this.date);
    yesterday.setDate(this.date.getDate() - (this.isWeekly() ? 7 : 1));
    this.date = yesterday;

    this.filterParams.all = false;
    this.setEvents();
  }

  goForwards(): void {
    const tomorrow = new Date(this.date);
    tomorrow.setDate(this.date.getDate() + (this.isWeekly() ? 7 : 1));
    this.date = tomorrow;

    this.filterParams.all = false;
    this.setEvents();
  }

  goToToday(): void {
    let today = moment();
    if (this.isWeekly()) {
      today = today.startOf('week');
    }
    this.date = today.toDate();

    this.filterParams.all = false;
    this.setEvents();
  }

  setWeekInterval(event: any): void {
    this.date = event.period.start;
  }

  setDayEvents(): void {
    this.calendarEventsHelper.getUserEventsForCurrentDay(this.date, this.filterParams).then((events) => (this.events = events));
  }

  setWeekEvents(): void {
    this.calendarEventsHelper.getUserEventsForCurrentWeek(this.date, this.filterParams).then((events) => (this.events = events));
  }

  setDay(event: any): void {
    this.viewType = 'Zilnic';
    this.date = event.day.date;
    this.setDayEvents();
  }

  setDaily(event?: any): void {
    this.filterParams.all = false;
    this.filterParams.for = 'day';
    this.setDay({ day: { date: event || this.date } });
  }

  isTodayVisible(): boolean {
    if (this.isDaily()) {
      const today = moment(new Date());
      const selectedDay = moment(this.date);
      return selectedDay.isSame(today, 'date');
    } else {
      const startDay = moment(new Date()).startOf('week');
      const selectedDay = moment(this.date);
      return selectedDay.isSame(startDay, 'date');
    }
  }

  openAddEventDialog(event?: any): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '40%',
      data: { date: event ? event.date : new Date(), setStartHour: !event }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resolveEvent(result);
      }
    });
  }

  resolveEvent(event: any): void {
    this.calendarEventsHelper.resolveEvent(event, this.date, this.filterParams).then(
      (result) => {
        let message: string;
        if (result.successfully) {
          message = `Au fost create cu succes ${result.successfully + 1} evenimente!`;
        } else {
          message = `Evenimentul a fost ${result.mode === 'add' ? 'adaugat' : 'editat'} cu succes!`;
        }
        this.events = result.events;
        this.notificationHelper.openNotification(message, 'success');
      },
      (error) => this.notificationHelper.notifyWithError(error)
    );
  }

  goToDay(event: any): void {
    this.date = event;
    this.setEvents();
  }

  ngOnDestroy(): void {
    this.cookieService.remove('auth_token');
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 6 || date.getDay() === 0;
  }

  openEvent(event: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        event: event.event,
        resolveEvent: (result: any) => this.resolveEvent(result),
        filter: { date: this.date, ...this.filterParams },
        copyEvent: (copyEvent: IEvent) => {
          this.copyEvent(copyEvent);
        }
      },
      position: this.getEventDialogPosition(event, event.event),
      backdropClass: 'event-background'
    });
  }

  getEventDialogPosition(event: any, eventObj: IEvent): {} {
    const positions = event.sourceEvent.currentTarget.getBoundingClientRect();
    let left;

    if (this.isDaily()) {
      left = event.sourceEvent.x + 50;
    } else {
      const day = eventObj.start.getDay();
      if (day === 6 || day === 0) {
        left = positions.left - 410;
      } else {
        left = positions.right + 10;
      }
    }

    const windowHeight = window.innerHeight;

    if (windowHeight - positions.top > windowHeight - 150) {
      return {
        top: `5px`,
        left: `${left}px`
      };
    } else if (windowHeight - positions.bottom > windowHeight / 2) {
      return {
        top: `${positions.top - 150}px`,
        left: `${left}px`
      };
    } else if (windowHeight - positions.bottom > windowHeight / 4) {
      return {
        bottom: `${windowHeight - positions.bottom - 200}px`,
        left: `${left}px`
      };
    } else if (windowHeight - positions.bottom > 50) {
      return {
        bottom: `${windowHeight - positions.bottom - 20}px`,
        left: `${left}px`
      };
    } else if (windowHeight - positions.bottom > 0) {
      return {
        bottom: `${windowHeight - positions.bottom}px`,
        left: `${left}px`
      };
    } else {
      return {
        bottom: `5px`,
        left: `${left}px`
      };
    }
  }

  getNrOfHoursOnDay(date: Date): number {
    let hours = 0;
    this.events.forEach((event) => {
      const start = event.start;
      const end = event.end;
      if (start.getDay() === date.getDay() && start.getMonth() === date.getMonth() && start.getFullYear() === date.getFullYear()) {
        hours += (end.getHours() === 0 ? 24 : end.getHours()) - start.getHours();
      }
    });
    return hours;
  }

  changeMode(): void {
    if (this.viewMode === 'list') {
      this.viewMode = 'calendar';
      this.initCalendarFilters();
    } else {
      this.viewMode = 'list';
      this.initListFilter();
    }
    this.setEvents();
  }

  initCalendarFilters(): void {
    this.filterParams = {
      sort: '',
      direction: '',
      subactivity: '',
      activity: '',
      start_date_filter: '',
      end_date_filter: '',
      all: false,
      course: '',
      project: ''
    };
  }

  initListFilter(): void {
    this.filterParams = {
      sort: 'date',
      direction: 'desc',
      subactivity: '',
      activity: '',
      start_date_filter: '',
      end_date_filter: '',
      all: false,
      course: '',
      project: ''
    };
  }

  eventsForList(): MatTableDataSource<IEvent> {
    const events = new MatTableDataSource<IEvent>();
    events.data = this.events;

    return events;
  }

  filterEvents(params: {
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
  }): void {
    this.filterParams = params;

    this.setEvents();
  }

  setEvents(): void {
    if (this.isDaily()) {
      this.setDayEvents();
    } else {
      this.setWeekEvents();
    }
  }

  editEvent(event: IEvent): void {
    this.editEventAction(event);
  }

  deleteEvent(event: IEvent): void {
    this.calendarEventsHelper.deleteEventAction(event);
  }

  openCopyEventsDialog(): void {
    const dialogRef = this.dialog.open(CopyEventsDialogComponent, {
      width: '40%',
      data: {
        mode: this.isDaily() ? 'daily' : 'weekly',
        date: this.date
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.copyEvents({ ...result, filter: { date: this.date, ...this.filterParams } }).subscribe(
          (copyResult) => {
            this.events = this.calendarEventsHelper.addEvents(copyResult.events);
            if (copyResult.successfully === 0) {
              this.notificationHelper.openNotification(`Nu a putut fi copiat niciun eveniment`, 'error');
            } else {
              this.notificationHelper.openNotification(
                `Au fost ${result.move ? 'mutate' : 'copiate'} cu succes ${copyResult.successfully} evenimente!`,
                'success'
              );
            }
          },
          (error) => this.notificationHelper.notifyWithError(error)
        );
      }
    });
  }

  editEventAction(event: IEvent): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '40%',
      data: { event, setStartHour: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resolveEvent(result);
      }
    });
  }

  getEndDateForWeekly(): Date {
    const endDate = new Date(this.date);
    endDate.setDate(this.date.getDate() + 6);
    return endDate;
  }

  getTooltipText(): string {
    let result = 'Informatii despre ' + (this.isDaily() ? 'ziua' : 'saptamana') + ' actuala:&#13;' + this.date.toLocaleDateString();
    if (this.isWeekly()) {
      result += ' - ' + this.getEndDateForWeekly().toLocaleDateString();
    }
    result += '&#13;&#13;Evenimente: ' + this.events.length + '&#13;Ore inregistrate: ' + this.getNrOfHours();
    return result;
  }

  getNrOfHours(): number {
    if (this.isDaily()) {
      return this.getNrOfHoursOnDay(this.date);
    } else {
      let totalHoursOnWeek = 0;
      for (let i = 0; i < 7; i++) {
        const date = new Date(this.date);
        date.setDate(this.date.getDate() + i);
        totalHoursOnWeek += this.getNrOfHoursOnDay(date);
      }
      return totalHoursOnWeek;
    }
  }

  getNrOfActivityTypeEvents(type: string): number {
    return this.events.filter((event) => event.activity === type).length;
  }

  getNrOfHoursForTypeEvents(type: string): number {
    const events: IEvent[] = this.events.filter((event) => event.activity === type);
    let hours = 0;
    events.forEach((event) => {
      const startHour = event.start.getHours();
      const endHour = event.end.getHours();
      hours += (endHour === 0 ? 24 : endHour) - startHour;
    });
    return hours;
  }

  isEmployee(): boolean {
    return JSON.parse(localStorage.getItem('user') as string).type === 'Angajat';
  }

  copyEvent(event: IEvent): void {
    const endHour = event.end.getHours();
    const dialogRef = this.dialog.open(CopyEventDialogComponent, {
      width: '40%',
      data: { eventLength: (endHour === 0 ? 24 : endHour) - event.start.getHours() }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const start = new Date(result.date);
        start.setHours(result.startHour);

        this.eventService
          .copyEvent({
            event_id: event.id,
            date: start,
            filter: { date: this.date, ...this.filterParams }
          })
          .subscribe(
            (copyResult) => {
              this.events = this.calendarEventsHelper.addEvents(copyResult.events);
              if (copyResult.successfully === 0) {
                this.notificationHelper.openNotification(`Evenimentul nu a putut fi copiat!`, 'error');
              } else {
                this.notificationHelper.openNotification(`Au fost create cu succes ${copyResult.successfully} evenimente!`, 'success');
              }
            },
            (error) => this.notificationHelper.notifyWithError(error)
          );
      }
    });
  }
}
