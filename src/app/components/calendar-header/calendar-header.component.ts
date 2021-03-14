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
  @Input() isDaily: boolean;
  @Input() date: Date;

  format: string;
  endWeekDay: Date;

  constructor() {}

  ngOnInit(): void {}

  executeGoBackwards(event: Event): void {
    this.goBackwards.emit(event);
  }

  executeGoForwards(event: Event): void {
    this.goForwards.emit(event);
  }

  executeSetWeekly(event: Event): void {
    this.setWeekly.emit(event);
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
