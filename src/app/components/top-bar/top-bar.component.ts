import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CoursesDialogComponent } from '../../dialogs/courses-dialog/courses-dialog.component';
import { ProjectsDialogComponent } from '../../dialogs/projects-dialog/projects-dialog.component';
import { PersonalInformationDialogComponent } from '../../dialogs/personal-information-dialog/personal-information-dialog.component';
import { UserService } from '../../services/user.service';
import { SettingsDialogComponent } from '../../dialogs/settings-dialog/settings-dialog.component';
import { CookieService } from 'ngx-cookie';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { NotificationHelper } from '../../helpers/notification-helper';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.sass']
})
export class TopBarComponent implements OnInit {
  @Output() setEvents = new EventEmitter<any>();

  constructor(
    private loginService: LoginService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private cookieService: CookieService,
    private calendarEventsHelper: CalendarEventsHelper,
    private notificationHelper: NotificationHelper
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout().subscribe(
      () => {
        this.cookieService.remove('auth_token');
        this.calendarEventsHelper.deleteEvents();
        this.router.navigate(['/login']);
      },
      (error) => this.notificationHelper.notifyWithError(error)
    );
  }

  openCoursesDialog(): void {
    this.dialog.open(CoursesDialogComponent, {
      position: {
        top: '100px'
      },
      width: '80%',
      data: {
        emitter: this.setEvents
      }
    });
  }

  openProjectsDialog(): void {
    this.dialog.open(ProjectsDialogComponent, {
      position: {
        top: '100px'
      },
      width: '80%',
      data: {
        emitter: this.setEvents
      }
    });
  }

  openPersonalInfoDialog(): void {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const dialogRef = this.dialog.open(PersonalInformationDialogComponent, {
      width: '50%',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (user.first_name !== result.firstName || user.last_name !== result.lastName) {
          this.userService.updateCurrentUser(result).subscribe(
            (updateResult) => {
              localStorage.setItem('user', JSON.stringify(updateResult));
              this.notificationHelper.openNotification('Informatiile personale au fost actualizate cu succes!', 'success');
            },
            (error) => this.notificationHelper.notifyWithError(error)
          );
        }
      }
    });
  }

  openSettingsDialog(): void {
    this.dialog.open(SettingsDialogComponent, {
      width: '50%',
      data: {}
    });
  }

  isEmployee(): boolean {
    return JSON.parse(localStorage.getItem('user') as string).type === 'Angajat';
  }
}
