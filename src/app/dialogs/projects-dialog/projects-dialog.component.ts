import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IProject } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-projects-dialog',
  templateUrl: './projects-dialog.component.html',
  styleUrls: ['./projects-dialog.component.sass']
})
export class ProjectsDialogComponent implements OnInit {
  projects = new MatTableDataSource<IProject>();
  columnNames: string[] = ['name', 'description'];

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
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.projectService.save(result).subscribe((projectsResult) => {
        this.projects.data = projectsResult;
        this.refresh();
      });
    });
  }

  downloadTemplate(): void {}

  importFile(): void {}
}
