import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-courses-dialog',
  templateUrl: './courses-dialog.component.html',
  styleUrls: ['./courses-dialog.component.sass']
})
export class CoursesDialogComponent implements OnInit {
  @ViewChild('importMenuTrigger') importMenuTrigger: MatMenuTrigger;

  constructor(public dialogRef: MatDialogRef<CoursesDialogComponent>) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  addCourse(): void {}

  downloadTemplate(): void {}

  importFile(): void {}
}
