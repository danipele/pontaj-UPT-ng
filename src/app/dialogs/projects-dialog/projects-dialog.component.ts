import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IProject } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { AddEditProjectDialogComponent } from '../add-edit-project-dialog/add-edit-project-dialog.component';
import { ICourse } from '../../models/course.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { indexOf } from 'lodash';

@Component({
  selector: 'app-projects-dialog',
  templateUrl: './projects-dialog.component.html',
  styleUrls: ['./projects-dialog.component.sass']
})
export class ProjectsDialogComponent implements OnInit {
  projects = new MatTableDataSource<IProject>();
  columnNames: string[] = ['name', 'description', 'edit', 'delete'];

  constructor(public dialogRef: MatDialogRef<ProjectsDialogComponent>, public dialog: MatDialog, public projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe((result) => {
      this.projects.data = result;
      this.refresh();
    });
  }

  refresh(): void {
    this.projects.data = this.projects.data;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addProject(): void {
    const dialogRef = this.dialog.open(AddEditProjectDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.projectService.add(result).subscribe((projectsResult) => {
        this.projects.data = projectsResult;
        this.refresh();
      });
    });
  }

  editProject(course: ICourse): void {
    const dialogRef = this.dialog.open(AddEditProjectDialogComponent, {
      width: '50%',
      data: course
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.projectService.update(result).subscribe((projectsResult) => {
        this.projects.data = projectsResult;
        this.refresh();
      });
    });
  }

  deleteProject(project: IProject): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Esti sigur ca vrei sa stergi acest proiect?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.projectService.delete(project.id).subscribe(() => {
          const index = indexOf(this.projects.data, project);
          if (index !== -1) {
            this.projects.data.splice(index, 1);
          }
          this.refresh();
        });
      }
    });
  }

  downloadTemplate(): void {}

  importFile(): void {}
}
