import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationHelper } from '../../helpers/notification-helper';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminUserDialogComponent } from '../../dialogs/create-admin-user-dialog/create-admin-user-dialog.component';

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
    private notificationHelper: NotificationHelper
  ) {}

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe(
      (user) => {
        if (user.type !== 'Admin') {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          this.notificationHelper.openNotification('Trebuie sa te loghezi pentru a intra in cont.', 'error');
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

  addHolidays(): void {}
}
