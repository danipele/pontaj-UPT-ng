import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CoursesDialogComponent } from '../../dialogs/courses-dialog/courses-dialog.component';
import { ProjectsDialogComponent } from '../../dialogs/projects-dialog/projects-dialog.component';
import { PersonalInformationDialogComponent } from '../../dialogs/personal-information-dialog/personal-information-dialog.component';
import { IUser } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { SettingsDialogComponent } from '../../dialogs/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.sass']
})
export class TopBarComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router, public dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  openCoursesDialog(): void {
    this.dialog.open(CoursesDialogComponent, {
      position: {
        top: '100px'
      },
      width: '80%',
      data: {}
    });
  }

  openProjectsDialog(): void {
    this.dialog.open(ProjectsDialogComponent, {
      position: {
        top: '100px'
      },
      width: '80%',
      data: {}
    });
  }

  openPersonalInfoDialog(): void {
    this.userService.getAuthenticatedUser().subscribe((user: IUser) => {
      this.dialog.open(PersonalInformationDialogComponent, {
        width: '50%',
        data: { user }
      });
    });
  }

  openSettingsDialog(): void {
    this.dialog.open(SettingsDialogComponent, {
      width: '50%',
      data: {}
    });
  }
}
