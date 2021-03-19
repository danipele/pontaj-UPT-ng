import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-edit-course-dialog',
  templateUrl: './add-edit-course-dialog.component.html',
  styleUrls: ['./add-edit-course-dialog.component.sass']
})
export class AddEditCourseDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddEditCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ICourse) {
    this.formGroup = new FormGroup({
      courseName: new FormControl(),
      courseStudentYear: new FormControl(),
      courseSemester: new FormControl(),
      courseFaculty: new FormControl(),
      courseDescription: new FormControl()
    });
    if (data) {
      this.formGroup.controls.courseName.setValue(data.name);
      this.formGroup.controls.courseStudentYear.setValue(data.student_year);
      this.formGroup.controls.courseSemester.setValue(data.semester);
      this.formGroup.controls.courseFaculty.setValue(data.faculty);
      this.formGroup.controls.courseDescription.setValue(data.description);
    }
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  sendCourse(): {} {
    return {
      course: {
        id: this.data.id,
        name: this.formGroup.controls.courseName.value,
        student_year: this.formGroup.controls.courseStudentYear.value,
        semester: this.formGroup.controls.courseSemester.value,
        faculty: this.formGroup.controls.courseFaculty.value,
        description: this.formGroup.controls.courseDescription.value
      }
    };
  }
}
