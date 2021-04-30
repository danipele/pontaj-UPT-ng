import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { EventService } from '../../services/event.service';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { Hour, ValidStartHoursHelper } from '../../helpers/valid-start-hours-helper';
import { TranslateService } from '@ngx-translate/core';
import { LanguageHelper, LocaleIdFactory } from '../../helpers/language-helper';

interface Data {
  eventLength: number;
  restrictedStartHour: number;
  restrictedEndHour: number;
  type: string;
  isAvailableForWeekend: boolean;
}

@Component({
  selector: 'app-copy-event-dialog',
  templateUrl: './copy-event-dialog.component.html',
  styleUrls: ['./copy-event-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useFactory: LocaleIdFactory, deps: [LanguageHelper] },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class CopyEventDialogComponent implements OnInit {
  date: Date;
  hours: Hour[];
  hour?: number;
  badHolidayDateMessage: string | undefined;

  holidayFilter = (date: Date | null): boolean => {
    return (this.data.type !== 'holidays' && this.data.isAvailableForWeekend) || (date?.getDay() !== 6 && date?.getDay() !== 0);
  }

  constructor(
    public dialogRef: MatDialogRef<CopyEventDialogComponent>,
    private eventService: EventService,
    private calendarEventsHelper: CalendarEventsHelper,
    private validStartHoursHelper: ValidStartHoursHelper,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {}

  ngOnInit(): void {}

  notAllFieldsAreFilled(): boolean {
    return !this.date || this.hour === undefined || this.badHolidayDateMessage !== undefined;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  sendData(): {} {
    return {
      date: this.date,
      startHour: this.hour
    };
  }

  setHours(event: any): void {
    if (this.data.type === 'holidays') {
      this.setBadHolidayDateMessage(event.value);
    } else {
      this.setStartHours();
    }
  }

  setStartHours(): void {
    this.eventService
      .getAll(this.date as Date, { for: 'day' })
      .pipe(
        map((result: []) => {
          return result.map((event) => this.calendarEventsHelper.createEvent(event));
        })
      )
      .toPromise()
      .then(
        (events) => {
          if (events.filter((event) => event.allDay).length === 1 && this.data.type !== 'project') {
            this.hours = [];
            this.hour = undefined;
          } else {
            this.hours = this.validStartHoursHelper.setStartHours(
              events,
              this.data.restrictedStartHour,
              this.data.restrictedEndHour,
              this.data.eventLength
            );
            this.restrictEndHour();
            this.hour = this.hours[0].value;
          }
        },
        () => this.cancel()
      );
  }

  restrictEndHour(): void {
    const availableEndHour = (this.data.restrictedEndHour || 24) - this.data.eventLength;
    while (this.hours[this.hours.length - 1].value > availableEndHour) {
      this.hours.splice(this.hours.length - 1);
    }
  }

  setBadHolidayDateMessage(date: Date): void {
    this.eventService
      .getAll(date as Date, { for: 'day' })
      .pipe(
        map((result: []) => {
          return result.map((event) => this.calendarEventsHelper.createEvent(event));
        })
      )
      .toPromise()
      .then(
        (events) => {
          if (events.filter((event) => event.type !== 'project').length === 0) {
            this.badHolidayDateMessage = undefined;
            this.hour = 0;
          } else {
            this.badHolidayDateMessage = this.translateService.instant('message.holidaysBadDay', {
              events: events.length,
              date: date?.toLocaleDateString().replace(/\/(.*)\//, '.$1.')
            });
          }
        },
        () => this.cancel()
      );
  }
}
