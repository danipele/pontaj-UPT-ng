import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationHelper } from '../../helpers/notification-helper';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminUserDialogComponent } from '../../dialogs/create-admin-user-dialog/create-admin-user-dialog.component';
import { AddHolidayForEmployeesDialogComponent } from '../../dialogs/add-holiday-for-employees-dialog/add-holiday-for-employees-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe(
      (user) => {
        if (user.type !== 'admin') {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          this.notificationHelper.openNotification(this.translateService.instant('login.needToLoginMessage'), 'error');
        }
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  addAdminUser(): void {
    const dialogRef = this.dialog.open(CreateAdminUserDialogComponent, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.createUser(result);
      }
    });
  }

  addHolidays(): void {
    const dialogRef = this.dialog.open(AddHolidayForEmployeesDialogComponent, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.addHolidays(result).subscribe(
          (res) => {
            if (res === 0) {
              this.notificationHelper.openNotification(this.translateService.instant('admin.couldNotAddVacationMessage'), 'error');
            } else {
              this.notificationHelper.openNotification(
                this.translateService.instant('admin.addedVacationMessage', { days: res }),
                'success'
              );
            }
          },
          (error) => this.notificationHelper.notifyWithError(error)
        );
      }
    });
  }
}
