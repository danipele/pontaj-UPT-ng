import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { LanguageHelper, LocaleIdFactory } from '../../helpers/language-helper';

@Component({
  selector: 'app-add-holiday-for-employees-dialog',
  templateUrl: './add-holiday-for-employees-dialog.component.html',
  styleUrls: ['./add-holiday-for-employees-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useFactory: LocaleIdFactory, deps: [LanguageHelper] },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class AddHolidayForEmployeesDialogComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  description = '';

  constructor(public dialogRef: MatDialogRef<AddHolidayForEmployeesDialogComponent>) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  sendData(): {} {
    return {
      start_date: this.startDate,
      end_date: this.endDate,
      description: this.description
    };
  }

  notAllFieldsAreFilled(): boolean {
    return !this.startDate || !this.endDate;
  }
}
