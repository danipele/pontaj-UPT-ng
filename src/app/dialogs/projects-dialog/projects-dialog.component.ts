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
import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService,
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
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.project'),
                action: this.translateService.instant('message.sg.added')
              }),
              'success'
            );
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
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.project'),
                action: this.translateService.instant('message.sg.edited')
              }),
              'success'
            );
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
        message: this.translateService.instant('message.deleteConfirmation', {
          objectType: this.translateService.instant('message.project')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.projectService.delete(project.id).subscribe(
          () => {
            this.deleteProjectFromList(project);
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.project'),
                action: this.translateService.instant('message.sg.deleted')
              }),
              'success'
            );
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
        saveAs(result, this.translateService.instant('project.fileName'));
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
          if (result.success) {
            this.projects.data = result.projects;
            this.refresh();
            this.notificationHelper.openNotification(
              this.translateService.instant('message.pl.successfully', {
                nr: result.added,
                objectsType: this.translateService.instant('message.projects'),
                action: this.translateService.instant('message.pl.added')
              }),
              'success'
            );
          } else {
            this.notificationHelper.openNotification(result.message, 'error');
          }
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
        message: this.translateService.instant('message.multipleDeleteConfirmation', {
          nr: this.selectedProjects.length,
          objectsType: this.translateService.instant('message.courses')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
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
            this.notificationHelper.openNotification(
              this.translateService.instant('message.pl.successfully', {
                nr: this.selectedProjects.length,
                objectsType: this.translateService.instant('message.projects'),
                action: this.translateService.instant('message.pl.deleted')
              }),
              'success'
            );
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
        saveAs(result, this.translateService.instant('project.filename'));
        this.notificationHelper.openNotification(
          this.translateService.instant('message.pl.successfully', {
            nr: this.selectedProjects.length,
            objectsType: this.translateService.instant('message.projects'),
            action: this.translateService.instant('message.pl.exported')
          }),
          'success'
        );
      },
      (error) => {
        this.notificationHelper.notifyWithError(error);
        this.cancel();
      }
    );
  }
}
