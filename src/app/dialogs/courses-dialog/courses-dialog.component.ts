import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditCourseDialogComponent } from '../add-edit-course-dialog/add-edit-course-dialog.component';
import { ICourse } from '../../models/course.model';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from '../../services/course.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { indexOf } from 'lodash';

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
    'faculty',
    'description',
    'edit',
    'delete',
    'add_timeline'
  ];
  selectedCourses: ICourse[] = [];

  constructor(public dialogRef: MatDialogRef<CoursesDialogComponent>, public dialog: MatDialog, public courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getAll().subscribe((result) => {
      this.courses.data = result;
      this.refresh();
    });
  }

  refresh(): void {
    this.courses.data = this.courses.data;
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
      this.courseService.add(result).subscribe((coursesResult) => {
        this.courses.data = coursesResult;
        this.refresh();
      });
    });
  }

  editCourse(course: ICourse): void {
    const dialogRef = this.dialog.open(AddEditCourseDialogComponent, {
      width: '50%',
      data: course
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.courseService.update(result).subscribe((coursesResult) => {
        this.courses.data = coursesResult;
        this.refresh();
      });
    });
  }

  deleteCourse(course: ICourse): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Esti sigur ca vrei sa stergi acest curs?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.courseService.delete(course.id).subscribe(() => {
          this.deleteCourseFromList(course);
        });
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

  downloadTemplate(): void {}

  importFile(): void {}

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
        message: 'Esti sigur ca vrei sa stergi ' + this.selectedCourses.length + ' cursuri?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.courseService.delete_selected(this.selectedCourses).subscribe(() => {
          if (this.selectedCourses.length === this.courses.data.length) {
            this.courses.data = [];
          } else {
            this.selectedCourses.forEach((course) => this.deleteCourseFromList(course));
          }
          this.selectedCourses = [];
          this.refresh();
        });
      }
    });
  }

  addTimeline(course: ICourse): void {}
}
