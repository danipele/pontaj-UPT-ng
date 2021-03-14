import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  viewDate: Date;
  viewType: string;
  date: Date;

  constructor() {
    this.viewDate = new Date();
    this.viewType = 'Saptamanal';
  }

  ngOnInit(): void {
    this.date = moment().startOf('week').toDate();
  }

  isWeekly(): boolean {
    return this.viewType === 'Saptamanal';
  }

  isDaily(): boolean {
    return this.viewType === 'Zilnic';
  }

  setWeekly(): void {
    this.viewType = 'Saptamanal';
  }

  goBackwards(): void {}

  goForwards(): void {}

  setWeekInterval(event: any): void {
    this.date = event.period.start;
  }

  setDay(event: any): void {
    this.viewType = 'Zilnic';
    this.date = event.day.date;
  }
}
