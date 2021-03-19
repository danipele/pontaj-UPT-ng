import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddCourseDialogComponent } from '../add-course-dialog/add-course-dialog.component';
import { ICourse } from '../../models/course.model';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses-dialog',
  templateUrl: './courses-dialog.component.html',
  styleUrls: ['./courses-dialog.component.sass']
})
export class CoursesDialogComponent implements OnInit {
  @ViewChild('importMenuTrigger') importMenuTrigger: MatMenuTrigger;
  courses = new MatTableDataSource<ICourse>();
  columnNames: string[] = ['name', 'student_year', 'semester', 'faculty', 'description'];

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
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.courseService.save(result).subscribe((coursesResult) => {
        this.courses.data = coursesResult;
        this.refresh();
      });
    });
  }

  downloadTemplate(): void {}

  importFile(): void {}
}
