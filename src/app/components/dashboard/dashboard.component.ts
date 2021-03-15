import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddTimelineDialogComponent } from '../../dialogs/add-timeline-dialog/add-timeline-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  viewType: string;
  date: Date;

  constructor(public dialog: MatDialog) {
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
    this.date = moment(this.date).startOf('week').toDate();
  }

  goBackwards(): void {
    const yesterday = new Date(this.date);
    yesterday.setDate(this.date.getDate() - (this.isWeekly() ? 7 : 1));
    this.date = yesterday;
  }

  goForwards(): void {
    const tomorrow = new Date(this.date);
    tomorrow.setDate(this.date.getDate() + (this.isWeekly() ? 7 : 1));
    this.date = tomorrow;
  }

  goToToday(): void {
    let today = moment();
    if (this.isWeekly()) {
      today = today.startOf('week');
    }
    this.date = today.toDate();
  }

  setWeekInterval(event: any): void {
    this.date = event.period.start;
  }

  setDay(event: any): void {
    this.viewType = 'Zilnic';
    this.date = event.day.date;
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

  openAddTimelineModal(event: any): void {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '40%',
      data: { date: event.date }
    });

    dialogRef.afterOpened().subscribe((result) => {
      const a = result;
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
