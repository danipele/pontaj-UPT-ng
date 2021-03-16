import { Injectable } from '@angular/core';
import { DateRange, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';

@Injectable()
export class WeekPickerStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this.createWeekRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this.createWeekRange(activeDate);
  }

  private createWeekRange(dDate: D | null): DateRange<D> {
    if (dDate) {
      const date = (dDate as unknown) as Date;
      const daysToStart = moment(date).startOf('week').toDate().getDate() - date.getDate();
      const daysToEnd = moment(date).endOf('week').toDate().getDate() - date.getDate();
      const start = this.dateAdapter.addCalendarDays(dDate, daysToStart);
      const end = this.dateAdapter.addCalendarDays(dDate, daysToEnd);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
