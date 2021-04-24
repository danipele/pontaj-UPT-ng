import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IProject } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { AddEditProjectDialogComponent } from '../add-edit-project-dialog/add-edit-project-dialog.component';
import { ICourse } from '../../models/course.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { indexOf } from 'lodash';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { saveAs } from 'file-saver';
import { NotificationHelper } from '../../helpers/notification-helper';

@Component({
  selector: 'app-projects-dialog',
  templateUrl: './projects-dialog.component.html',
  styleUrls: ['./projects-dialog.component.sass']
})
export class ProjectsDialogComponent implements OnInit {
  projects = new MatTableDataSource<IProject>();
  columnNames: string[] = [
    'select',
    'nr_crt',
    'name',
    'hours_per_month',
    'restricted_start_hour',
    'restricted_end_hour',
    'description',
    'edit',
    'delete',
    'add_event'
  ];
  selectedProjects: IProject[] = [];
  acceptedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  constructor(
    public dialogRef: MatDialogRef<ProjectsDialogComponent>,
    public dialog: MatDialog,
    public projectService: ProjectService,
    private notificationHelper: NotificationHelper,
    @Inject(MAT_DIALOG_DATA) public data: { emitter: EventEmitter<any> }
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe(
      (result) => {
        this.projects.data = result;
        this.refresh();
      },
      (error) => {
        this.cancel();
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  refresh(): void {
    this.projects = new MatTableDataSource<IProject>(this.projects.data);
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
      if (result) {
        this.projectService.add(result).subscribe(
          (projectsResult) => {
            this.projects.data = projectsResult;
            this.refresh();
            this.notificationHelper.openNotification('Proiectul a fost adaugat cu succes!', 'success');
          },
          (error) => {
            this.notificationHelper.notifyWithError(error);
            this.cancel();
          }
        );
      }
    });
  }

  editProject(course: ICourse): void {
    const dialogRef = this.dialog.open(AddEditProjectDialogComponent, {
      width: '50%',
      data: course
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.update(result).subscribe(
          (projectsResult) => {
            this.projects.data = projectsResult;
            this.refresh();
            this.notificationHelper.openNotification('Proiectul a fost editat cu succes!', 'success');
          },
          (error) => {
            this.notificationHelper.notifyWithError(error);
            this.cancel();
          }
        );
      }
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
        this.projectService.delete(project.id).subscribe(
          () => {
            this.deleteProjectFromList(project);
            this.notificationHelper.openNotification('Proiectul a fost sters cu succes!', 'success');
          },
          (error) => {
            this.notificationHelper.notifyWithError(error);
            this.cancel();
          }
        );
      }
    });
  }

  checkAll(checked: boolean): void {
    if (checked) {
      this.projects.data.forEach((project) => {
        if (!this.selectedProjects.includes(project)) {
          this.selectedProjects.push(project);
        }
      });
    } else {
      this.selectedProjects = [];
    }
  }

  checkProject(checked: boolean, project: IProject): void {
    if (checked) {
      this.selectedProjects.push(project);
    } else {
      const index = indexOf(this.selectedProjects, project);
      if (index !== -1) {
        this.selectedProjects.splice(index, 1);
      }
    }
  }

  downloadTemplate(): void {
    this.projectService.downloadTemplateApiUrl().subscribe(
      (result) => {
        saveAs(result, 'Proiecte.xls');
      },
      (error) => {
        this.cancel();
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  importFile(event: any): void {
    const file = event.target.files[0];
    if (this.acceptedFileTypes.includes(file.type)) {
      const formData: FormData = new FormData();
      formData.append('projects_file', file);
      this.projectService.importProjects(formData).subscribe(
        (result) => {
          this.projects.data = result.projects;
          this.refresh();
          this.notificationHelper.openNotification(`Au fost adaugate cu succes ${result.added} proiecte.`, 'success');
        },
        (error) => {
          this.notificationHelper.notifyWithError(error);
          this.cancel();
        }
      );
    }
  }

  deleteProjectFromList(project: IProject): void {
    const index = indexOf(this.projects.data, project);
    if (index !== -1) {
      this.projects.data.splice(index, 1);
    }
    this.refresh();
  }

  isProjectChecked(project: IProject): boolean {
    const index = indexOf(this.selectedProjects, project);
    return index !== -1;
  }

  deleteSelected(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Esti sigur ca vrei sa stergi ' + this.selectedProjects.length + ' proiecte?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.projectService.deleteSelected(this.selectedProjects).subscribe(
          () => {
            if (this.selectedProjects.length === this.projects.data.length) {
              this.projects.data = [];
            } else {
              this.selectedProjects.forEach((project) => this.deleteProjectFromList(project));
            }
            this.notificationHelper.openNotification(`Au fost sterse cu succes ${this.selectedProjects.length} proiecte.`, 'success');
            this.selectedProjects = [];
            this.refresh();
          },
          (error) => {
            this.notificationHelper.notifyWithError(error);
            this.cancel();
          }
        );
      }
    });
  }

  addEvent(project: IProject): void {
    this.cancel();
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '40%',
      data: {
        date: new Date(),
        project: { selected: project, projects: this.projects.data },
        setStartHour: true
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.emitter.emit(result);
      }
    });
  }

  exportProjects(): void {
    this.projectService.exportProjects(this.selectedProjects).subscribe(
      (result) => {
        saveAs(result, 'Proiecte.xls');
        this.notificationHelper.openNotification(`Au fost exportate cu succes ${this.selectedProjects.length} proiecte.`, 'success');
      },
      (error) => {
        this.notificationHelper.notifyWithError(error);
        this.cancel();
      }
    );
  }
}
