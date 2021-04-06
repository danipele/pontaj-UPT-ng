import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { WeekPickerStrategy } from '../../helpers/week-picker-strategy';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.sass'],
  providers: [
    { provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: WeekPickerStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class CalendarHeaderComponent implements OnInit, OnChanges {
  @Output() goBackwards = new EventEmitter();
  @Output() goForwards = new EventEmitter();
  @Output() setWeekly = new EventEmitter();
  @Output() goToToday = new EventEmitter();
  @Output() goToDay = new EventEmitter<Date>();
  @Input() isWeekly: boolean;
  @Input() isTodayVisible: boolean;
  @Input() date: Date;
  @Output() addTimeline = new EventEmitter();
  @Output() changeMode = new EventEmitter();
  @Input() mode: string;

  format: string;
  endWeekDay: Date;
  range: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  executeGoBackwards(): void {
    this.goBackwards.emit();
  }

  executeGoForwards(): void {
    this.goForwards.emit();
  }

  executeSetWeekly(): void {
    this.setWeekly.emit();
  }

  executeGoToToday(): void {
    this.goToToday.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isWeekly) {
      this.endWeekDay = new Date(this.date);
      this.endWeekDay.setDate(this.date.getDate() + 6);
    }
  }

  goToSelectedDay(event: any): void {
    this.goToDay.emit(event.value);
  }

  executeAddTimeline(): void {
    this.addTimeline.emit();
  }

  executeChangeMode(): void {
    this.changeMode.emit();
  }
}
