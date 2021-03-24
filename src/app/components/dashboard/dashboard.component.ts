import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddTimelineDialogComponent } from '../../dialogs/add-timeline-dialog/add-timeline-dialog.component';
import { CalendarEvent } from 'angular-calendar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {
  viewType: string;
  date: Date;
  events: CalendarEvent[];

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
  }

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe(
      () => {
        if (this.isDaily()) {
          this.setDayEvents();
        } else {
          this.setWeekEvents();
        }
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

    if (this.isDaily()) {
      this.setDayEvents();
    } else {
      this.setWeekEvents();
    }
  }

  goForwards(): void {
    const tomorrow = new Date(this.date);
    tomorrow.setDate(this.date.getDate() + (this.isWeekly() ? 7 : 1));
    this.date = tomorrow;

    if (this.isDaily()) {
      this.setDayEvents();
    } else {
      this.setWeekEvents();
    }
  }

  goToToday(): void {
    let today = moment();
    if (this.isWeekly()) {
      today = today.startOf('week');
    }
    this.date = today.toDate();

    if (this.isDaily()) {
      this.setDayEvents();
    } else {
      this.setWeekEvents();
    }
  }

  setWeekInterval(event: any): void {
    this.date = event.period.start;
  }

  setDayEvents(): void {
    this.calendarEventsHelper.getUserEventsForCurrentDay(this.date).then((events) => {
      this.events = events;
    });
  }

  setWeekEvents(): void {
    this.calendarEventsHelper.getUserEventsForCurrentWeek(this.date).then((events) => {
      this.events = events;
    });
  }

  setDay(event: any): void {
    this.viewType = 'Zilnic';
    this.date = event.day.date;
    this.setDayEvents();
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

  openAddTimelineDialog(event: any): void {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '40%',
      data: { date: event.date }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarEventsHelper.resolveEvent(result);
      }
    });
  }

  goToDay(event: any): void {
    this.date = event;
    if (this.isDaily()) {
      this.setDayEvents();
    } else {
      this.setWeekEvents();
    }
  }

  ngOnDestroy(): void {
    this.cookieService.remove('auth_token');
  }

  isToday(date: Date): boolean {
    return Math.floor(new Date().getTime() / 1000 / 3600 / 24) === Math.floor(date.getTime() / 1000 / 3600 / 24);
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 6 || date.getDay() === 0;
  }
}
