import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CoursesDialogComponent } from '../../dialogs/courses-dialog/courses-dialog.component';
import { ProjectsDialogComponent } from '../../dialogs/projects-dialog/projects-dialog.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.sass']
})
export class TopBarComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  openCoursesDialog(): void {
    const dialogRef = this.dialog.open(CoursesDialogComponent, {
      position: {
        top: '100px'
      },
      width: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      // do staff
    });
  }

  openProjectsDialog(): void {
    const dialogRef = this.dialog.open(ProjectsDialogComponent, {
      position: {
        top: '100px'
      },
      width: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      // do staff
    });
  }
}
