import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { WeekPickerStrategy } from '../../helpers/week-picker-strategy';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { LanguageHelper, LocaleIdFactory } from '../../helpers/language-helper';

interface Data {
  mode: string;
  date: Date;
}

@Component({
  selector: 'app-copy-events-dialog',
  templateUrl: './copy-events-dialog.component.html',
  styleUrls: ['./copy-events-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: WeekPickerStrategy },
    { provide: MAT_DATE_LOCALE, useFactory: LocaleIdFactory, deps: [LanguageHelper] },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class CopyEventsDialogComponent implements OnInit {
  endDate: Date;
  copyDate: Date;
  endCopyDate: Date;
  move: boolean;

  constructor(public dialogRef: MatDialogRef<CopyEventsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {
    if (data.mode === 'weekly') {
      this.endDate = new Date(data.date);
      this.endDate.setDate(data.date.getDate() + 6);
      this.copyDate = new Date(data.date);
      this.copyDate.setDate(data.date.getDate() + 7);
      this.endCopyDate = new Date(this.copyDate);
      this.endCopyDate.setDate(this.copyDate.getDate() + 6);
    } else {
      this.copyDate = new Date(data.date);
      this.copyDate.setDate(data.date.getDate() + 1);
    }
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  sendData(): {} {
    return {
      date: this.data.date,
      copy_date: this.copyDate,
      mode: this.data.mode,
      move: this.move
    };
  }

  setMove(value: boolean): void {
    this.move = value;
  }
}
