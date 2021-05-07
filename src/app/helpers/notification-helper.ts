import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationHelper {
  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {}

  openNotification(message: string, type: string): void {
    this.snackBar.open(message, 'x', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification', type === 'error' ? 'error-notification' : 'success-notification']
    });
  }

  notifyWithError(error: HttpErrorResponse): void {
    if (error.status === 500) {
      this.openNotification(this.translateService.instant('message.error'), 'error');
    } else if (error.status === 401) {
      this.openNotification(this.translateService.instant('message.expiredSession'), 'error');
    } else {
      this.openNotification(error.message, 'error');
    }
  }
}
