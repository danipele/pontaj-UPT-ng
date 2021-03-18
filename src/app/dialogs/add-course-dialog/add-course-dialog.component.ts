import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.sass']
})
export class AddCourseDialogComponent implements OnInit {
  course: ICourse;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddCourseDialogComponent>) {
    this.formGroup = new FormGroup({
      courseName: new FormControl(),
      courseStudentYear: new FormControl(),
      courseFaculty: new FormControl(),
      courseDescription: new FormControl()
    });
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  addCourse(): {} {
    return {
      course: {
        name: this.formGroup.controls.courseName.value,
        student_year: this.formGroup.controls.courseStudentYear.value,
        faculty: this.formGroup.controls.courseFaculty.value,
        description: this.formGroup.controls.courseDescription.value
      }
    };
  }
}
