import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditCourseDialogComponent } from '../add-edit-course-dialog/add-edit-course-dialog.component';
import { ICourse } from '../../models/course.model';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from '../../services/course.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { indexOf } from 'lodash';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { saveAs } from 'file-saver';
import { NotificationHelper } from '../../helpers/notification-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-courses-dialog',
  templateUrl: './courses-dialog.component.html',
  styleUrls: ['./courses-dialog.component.sass']
})
export class CoursesDialogComponent implements OnInit {
  courses = new MatTableDataSource<ICourse>();
  columnNames: string[] = [
    'select',
    'nr_crt',
    'name',
    'student_year',
    'semester',
    'cycle',
    'faculty',
    'description',
    'edit',
    'delete',
    'add_event'
  ];
  selectedCourses: ICourse[] = [];
  acceptedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  constructor(
    public dialogRef: MatDialogRef<CoursesDialogComponent>,
    public dialog: MatDialog,
    public courseService: CourseService,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { emitter: EventEmitter<any> }
  ) {}

  ngOnInit(): void {
    this.courseService.getAll().subscribe(
      (result) => {
        this.courses.data = result;
        this.refresh();
      },
      (error) => {
        this.cancel();
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  refresh(): void {
    this.courses = new MatTableDataSource<ICourse>(this.courses.data);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addCourse(): void {
    const dialogRef = this.dialog.open(AddEditCourseDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseService.add(result).subscribe(
          (coursesResult) => {
            this.courses.data = coursesResult;
            this.refresh();
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.course'),
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

  editCourse(course: ICourse): void {
    const dialogRef = this.dialog.open(AddEditCourseDialogComponent, {
      width: '50%',
      data: course
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseService.update(result).subscribe(
          (coursesResult) => {
            this.courses.data = coursesResult;
            this.refresh();
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.course'),
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

  deleteCourse(course: ICourse): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: this.translateService.instant('message.deleteConfirmation', {
          objectType: this.translateService.instant('message.course')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.courseService.delete(course.id).subscribe(
          () => {
            this.deleteCourseFromList(course);
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.course'),
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
      this.courses.data.forEach((course) => {
        if (!this.selectedCourses.includes(course)) {
          this.selectedCourses.push(course);
        }
      });
    } else {
      this.selectedCourses = [];
    }
  }

  checkCourse(checked: boolean, course: ICourse): void {
    if (checked) {
      this.selectedCourses.push(course);
    } else {
      const index = indexOf(this.selectedCourses, course);
      if (index !== -1) {
        this.selectedCourses.splice(index, 1);
      }
    }
  }

  downloadTemplate(): void {
    this.courseService.downloadTemplateApiUrl().subscribe(
      (result) => {
        saveAs(result, this.translateService.instant('course.fileName'));
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
      formData.append('courses_file', file);
      this.courseService.importCourses(formData).subscribe(
        (result) => {
          this.courses.data = result.courses;
          this.refresh();
          this.notificationHelper.openNotification(
            this.translateService.instant('message.pl.successfully', {
              nr: result.added,
              objectsType: this.translateService.instant('message.courses'),
              action: this.translateService.instant('message.pl.added')
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

  deleteCourseFromList(course: ICourse): void {
    const index = indexOf(this.courses.data, course);
    if (index !== -1) {
      this.courses.data.splice(index, 1);
    }
    this.refresh();
  }

  isCourseChecked(course: ICourse): boolean {
    const index = indexOf(this.selectedCourses, course);
    return index !== -1;
  }

  deleteSelected(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: this.translateService.instant('message.multipleDeleteConfirmation', {
          nr: this.selectedCourses.length,
          objectsType: this.translateService.instant('message.courses')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.courseService.deleteSelected(this.selectedCourses).subscribe(
          () => {
            if (this.selectedCourses.length === this.courses.data.length) {
              this.courses.data = [];
            } else {
              this.selectedCourses.forEach((course) => this.deleteCourseFromList(course));
            }
            this.notificationHelper.openNotification(
              this.translateService.instant('message.pl.successfully', {
                nr: this.selectedCourses.length,
                objectsType: this.translateService.instant('message.courses'),
                action: this.translateService.instant('message.pl.deleted')
              }),
              'success'
            );
            this.selectedCourses = [];
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

  addEvent(course: ICourse): void {
    this.cancel();
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '40%',
      data: {
        date: new Date(),
        course: { selected: course, courses: this.courses.data },
        setStartHour: true
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.emitter.emit(result);
      }
    });
  }

  exportCourses(): void {
    this.courseService.exportCourses(this.selectedCourses).subscribe(
      (result) => {
        saveAs(result, this.translateService.instant('course.fileName'));
        this.notificationHelper.openNotification(
          this.translateService.instant('message.pl.successfully', {
            nr: this.selectedCourses.length,
            objectsType: this.translateService.instant('message.courses'),
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
