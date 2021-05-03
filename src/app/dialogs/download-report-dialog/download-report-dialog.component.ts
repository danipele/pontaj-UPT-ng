import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { EventService } from '../../services/event.service';
import { IProject } from '../../models/project.model';
import { saveAs } from 'file-saver';

interface Data {
  reportType: string;
  project: IProject;
}

@Component({
  selector: 'app-download-report-dialog',
  templateUrl: './download-report-dialog.component.html',
  styleUrls: ['./download-report-dialog.component.sass']
})
export class DownloadReportDialogComponent implements OnInit {
  dateValue = '';
  date: Date;

  constructor(
    public dialogRef: MatDialogRef<DownloadReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private translateService: TranslateService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {}

  reportTitle(): string {
    const reportType = this.translateService.instant('report.' + this.data.reportType);
    if (this.data.project) {
      return `${reportType}: ${this.data.project.name}`;
    } else {
      return reportType;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  notAllFieldsAreFilled(): boolean {
    return !this.dateValue;
  }

  downloadReport(): void {
    let params: any = { type: this.data.reportType, date: this.date };
    if (this.data.project) {
      params = { ...params, project: this.data.project.id };
    }
    this.eventService.downloadReport(params).subscribe((result) => {
      const language = this.translateService.currentLang;
      const user = JSON.parse(localStorage.getItem('user') as string);
      const filename = `${user.last_name} ${user.first_name}_${this.date.toLocaleString(language + '-' + language.toUpperCase(), {
        month: 'long'
      })} ${this.date.getFullYear()}.xls`;
      saveAs(result, filename);
      this.cancel();
    });
  }

  dateType(): string {
    return 'monthly';
  }

  setDateValue(value: string): void {
    this.dateValue = value;
  }

  monthSelected(event: any, picker: MatDatepicker<Date>): void {
    this.date = event;
    picker.close();
  }
}
