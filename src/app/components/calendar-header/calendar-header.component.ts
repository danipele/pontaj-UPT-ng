import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.sass']
})
export class CalendarHeaderComponent implements OnInit, OnChanges {
  @Output() goBackwards = new EventEmitter();
  @Output() goForwards = new EventEmitter();
  @Output() setWeekly = new EventEmitter();
  @Output() goToToday = new EventEmitter();
  @Input() isDaily: boolean;
  @Input() isTodayVisible: boolean;
  @Input() date: Date;

  format: string;
  endWeekDay: Date;

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
    if (this.isDaily) {
      this.format = 'EEEE, dd MMM yyyy';
    } else {
      this.format = 'dd MMM yyyy';
      this.endWeekDay = new Date(this.date);
      this.endWeekDay.setDate(this.date.getDate() + 6);
    }
  }
}
