import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddTimelineDialogComponent } from '../../dialogs/add-timeline-dialog/add-timeline-dialog.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { CookieService } from 'ngx-cookie';
import { EventDialogComponent } from '../../dialogs/event-dialog/event-dialog.component';
import { IEvent } from '../../models/event.model';
import { MatTableDataSource } from '@angular/material/table';

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
  };

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private calendarEventsHelper: CalendarEventsHelper,
    private cookieService: CookieService
  ) {
    this.viewType = 'Saptamanal';
    this.date = moment().startOf('week').toDate();
    this.events = [];
    this.viewMode = 'calendar';
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
        }
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
    this.setWeekEvents();
  }

  goBackwards(): void {
    const yesterday = new Date(this.date);
    yesterday.setDate(this.date.getDate() - (this.isWeekly() ? 7 : 1));
    this.date = yesterday;

    this.setEvents();
  }

  goForwards(): void {
    const tomorrow = new Date(this.date);
    tomorrow.setDate(this.date.getDate() + (this.isWeekly() ? 7 : 1));
    this.date = tomorrow;

    this.setEvents();
  }

  goToToday(): void {
    let today = moment();
    if (this.isWeekly()) {
      today = today.startOf('week');
    }
    this.date = today.toDate();

    this.setEvents();
  }

  setWeekInterval(event: any): void {
    this.date = event.period.start;
  }

  setDayEvents(): void {
    this.calendarEventsHelper.getUserEventsForCurrentDay(this.date, this.filterParams).then((events) => {
      this.events = events;
    });
  }

  setWeekEvents(): void {
    this.calendarEventsHelper.getUserEventsForCurrentWeek(this.date, this.filterParams).then((events) => {
      this.events = events;
    });
  }

  setDay(event: any): void {
    this.viewType = 'Zilnic';
    this.date = event.day.date;
    this.setDayEvents();
  }

  setDaily(): void {
    this.setDay({ day: { date: this.date } });
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

  openAddTimelineDialog(event?: any): void {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '40%',
      data: { date: event ? event.date : new Date() }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarEventsHelper.resolveEvent(result);
      }
    });
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
    return today.getDay() === date.getDay() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 6 || date.getDay() === 0;
  }

  openEvent(event: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { event: event.event },
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
        left = positions.left - 310;
      } else {
        left = positions.right + 10;
      }
    }
    return {
      top: `${positions.top - 100}px`,
      left: `${left}px`
    };
  }

  getNrOfHoursOnDay(date: Date): number {
    let hours = 0;
    this.events.forEach((event) => {
      const start = event.start;
      const end = event.end;
      if (start.getDay() === date.getDay() && start.getMonth() === date.getMonth() && start.getFullYear() === date.getFullYear()) {
        hours += end.getHours() - start.getHours();
      }
    });
    return hours;
  }

  changeMode(): void {
    if (this.viewMode === 'table') {
      this.viewMode = 'calendar';
      this.filterParams = { sort: '', direction: '', subactivity: '', activity: '' };
    } else {
      this.viewMode = 'table';
      this.filterParams = { sort: 'date', direction: 'desc', subactivity: '', activity: '' };
    }
    this.setEvents();
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
    this.calendarEventsHelper.editEventAction(event);
  }

  deleteEvent(event: IEvent): void {
    this.calendarEventsHelper.deleteEventAction(event);
  }
}
