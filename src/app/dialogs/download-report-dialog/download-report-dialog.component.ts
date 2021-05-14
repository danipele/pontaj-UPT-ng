import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { EventService } from '../../services/event.service';
import { IProject } from '../../models/project.model';
import { saveAs } from 'file-saver';
import { NotificationHelper } from '../../helpers/notification-helper';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { LanguageHelper, LocaleIdFactory } from '../../helpers/language-helper';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';

interface Data {
  reportType: string;
  project: IProject;
  period: string;
}

@Component({
  selector: 'app-download-report-dialog',
  templateUrl: './download-report-dialog.component.html',
  styleUrls: ['./download-report-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useFactory: LocaleIdFactory, deps: [LanguageHelper] },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class DownloadReportDialogComponent implements OnInit {
  dateValue = '';
  date: Date;
  financingContract = '';
  projectManager = '';
  departmentDirector = '';
  weeklyStatusMessage = '';

  constructor(
    public dialogRef: MatDialogRef<DownloadReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private translateService: TranslateService,
    private eventService: EventService,
    private notificationHelper: NotificationHelper
  ) {}

  ngOnInit(): void {}

  reportTitle(): string {
    const reportType = this.translateService.instant('report.' + this.data.reportType);
    if (this.data.project) {
      return `${reportType}: ${this.data.project.name}`;
    } else if (this.data.period) {
      return `${reportType}: ${this.translateService.instant('calendar.' + this.data.period)}`;
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
    const params: any = { type: this.data.reportType, date: this.date };
    let additionalParams: any = {};

    switch (this.data.reportType) {
      case 'projectReport': {
        additionalParams = {
          project: this.data.project.id,
          financing_contract: this.financingContract,
          project_manager: this.projectManager
        };
        break;
      }
      case 'teacherReport': {
        additionalParams = { period: this.data.period };
        break;
      }
      case 'onlineReport': {
        additionalParams = { department_director: this.departmentDirector };
        break;
      }
    }

    this.eventService.downloadReport({ ...params, ...additionalParams }).subscribe(
      (result) => {
        const filename = this.setFilename();
        saveAs(result, filename);
        this.notificationHelper.openNotification(this.notificationMessage(), 'success');
        this.cancel();
      },
      (error) => {
        this.notificationHelper.notifyWithError(error);
        this.cancel();
      }
    );
  }

  notificationMessage(): string {
    const language = this.translateService.currentLang;

    switch (this.data.reportType) {
      case 'projectReport': {
        return this.translateService.instant('report.messages.projectReport', {
          project: this.data.project.name,
          date: `${this.date.toLocaleString(language + '-' + language.toUpperCase(), {
            month: 'long'
          })} ${this.date.getFullYear()}`
        });
      }
      case 'teacherReport': {
        return this.translateService.instant('report.messages.teacherReport', {
          period: this.translateService.instant('report.messages.' + this.data.period),
          date: `${this.date.toLocaleString(language + '-' + language.toUpperCase(), {
            month: 'long'
          })} ${this.date.getFullYear()}`
        });
      }
      case 'onlineReport': {
        return this.translateService.instant('report.messages.onlineReport', {
          date: `${this.date.toLocaleString(language + '-' + language.toUpperCase(), {
            month: 'long'
          })} ${this.date.getFullYear()}`
        });
      }
    }

    return '';
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
    if (this.data.reportType === 'teacherReport' && this.data.period === 'weekly') {
      this.eventService.weeklyReportStatus({ date: event }).subscribe((warningDays) => {
        if (warningDays === 0) {
          this.weeklyStatusMessage = this.translateService.instant('report.messages.weeklyStatusNoWarning');
        } else {
          this.weeklyStatusMessage = this.translateService.instant('report.messages.weeklyStatusWarning', { nrDays: warningDays });
        }
      });
    }
  }

  setFilename(): string {
    const language = this.translateService.currentLang;
    const user = JSON.parse(localStorage.getItem('user') as string);

    switch (this.data.reportType) {
      case 'projectReport': {
        return `${user.last_name} ${user.first_name}_${this.date.toLocaleString(language + '-' + language.toUpperCase(), {
          month: 'long'
        })} ${this.date.getFullYear()}.xls`;
      }
      case 'teacherReport': {
        if (this.data.period === 'monthly') {
          return `${user.last_name}_${user.first_name}_${this.translateService.instant('report.teacherReportMonthlyName')}_1-${new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            0
          ).getDate()}_${this.date.toLocaleString(language + '-' + language.toUpperCase(), {
            month: 'long'
          })}-${this.date.getFullYear()}.xls`;
        } else {
          let name = `${this.translateService.instant('hours')}-${this.date.getFullYear()}.${this.date.getMonth()}-`;
          if (user.type === 'employee') {
            name += 'TIT+CMDD-';
          } else {
            name += 'PO-extern-';
          }
          return `${name}${user.last_name}-${user.first_name}.xls`.substr(1);
        }
      }
      case 'onlineReport': {
        return `${user.last_name}, ${user.first_name} ${this.translateService.instant(
          'report.annexes'
        )} ${this.date.getFullYear()}-${this.date.getMonth()}.xls`;
      }
    }

    return 'raport fara nume.xls';
  }
}
