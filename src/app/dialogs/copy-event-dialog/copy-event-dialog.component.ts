import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { EventService } from '../../services/event.service';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { Hour, ValidStartHoursHelper } from '../../helpers/valid-start-hours-helper';

interface Data {
  eventLength: number;
  restrictedStartHour: number;
  restrictedEndHour: number;
}

@Component({
  selector: 'app-copy-event-dialog',
  templateUrl: './copy-event-dialog.component.html',
  styleUrls: ['./copy-event-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class CopyEventDialogComponent implements OnInit {
  date: Date;
  hours: Hour[];
  hour: number;

  constructor(
    public dialogRef: MatDialogRef<CopyEventDialogComponent>,
    private eventService: EventService,
    private calendarEventsHelper: CalendarEventsHelper,
    private validStartHoursHelper: ValidStartHoursHelper,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {}

  ngOnInit(): void {}

  notAllFieldsAreFilled(): boolean {
    return !this.hours && !this.hour;
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

  setHours(): void {
    this.eventService
      .getAll(this.date as Date, { for: 'day' })
      .pipe(
        map((result: []) => {
          return this.calendarEventsHelper.addEvents(result);
        })
      )
      .toPromise()
      .then(
        (events) => {
          this.hours = this.validStartHoursHelper.setStartHours(events, this.data.restrictedStartHour, this.data.eventLength);
          this.restrictEndHour();
          this.hour = this.hours[0].value;
        },
        () => this.cancel()
      );
  }

  restrictEndHour(): void {
    const availableEndHour = this.data.restrictedEndHour - this.data.eventLength;
    while (this.hours[this.hours.length - 1].value > availableEndHour) {
      this.hours = this.hours.splice(0, this.hours.length - 1);
    }
  }
}
