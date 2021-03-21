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
      const daysToStartOfWeek = moment(date).startOf('week').toDate().getDate() - date.getDate();
      const daysToEndOfWeek = moment(date).endOf('week').toDate().getDate() - date.getDate();
      const daysToStartOfMonth = moment(date).startOf('month').toDate().getDate() - date.getDate();
      const daysToEndOfMonth = moment(date).endOf('month').toDate().getDate() - date.getDate();
      const start = this.dateAdapter.addCalendarDays(dDate, daysToStartOfWeek > 0 ? daysToStartOfMonth : daysToStartOfWeek);
      const end = this.dateAdapter.addCalendarDays(dDate, daysToEndOfWeek < 0 ? daysToEndOfMonth : daysToEndOfWeek);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
