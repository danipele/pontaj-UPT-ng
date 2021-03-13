import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.sass']
})
export class CalendarHeaderComponent implements OnInit {
  @Output() setMonthly = new EventEmitter();
  @Output() setWeekly = new EventEmitter();
  @Output() setDaily = new EventEmitter();
  @Input() viewType: string | null = null;
  @Input() viewDate: Date = new Date();
  @Input() isMonthly = false;
  @Input() isWeekly = false;
  @Input() isDaily = false;
  @Output() goBackwards = new EventEmitter();
  @Output() goForwards = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  executeSetMonthly(event: Event): void {
    this.setMonthly.emit(event);
  }

  executeSetWeekly(event: Event): void {
    this.setWeekly.emit(event);
  }

  executeSetDaily(event: Event): void {
    this.setDaily.emit(event);
  }

  executeGoBackwards(event: Event): void {
    this.goBackwards.emit(event);
  }

  executeGoForwards(event: Event): void {
    this.goForwards.emit(event);
  }
}
