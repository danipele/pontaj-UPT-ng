import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddCourseDialogComponent } from '../add-course-dialog/add-course-dialog.component';
import { ICourse } from '../../models/course.model';

@Component({
  selector: 'app-courses-dialog',
  templateUrl: './courses-dialog.component.html',
  styleUrls: ['./courses-dialog.component.sass']
})
export class CoursesDialogComponent implements OnInit {
  @ViewChild('importMenuTrigger') importMenuTrigger: MatMenuTrigger;
  courses: ICourse[];

  constructor(public dialogRef: MatDialogRef<CoursesDialogComponent>, public dialog: MatDialog) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  addCourse(): void {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.courses.push(result.course);
    });
  }

  downloadTemplate(): void {}

  importFile(): void {}
}
