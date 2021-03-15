import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-projects-dialog',
  templateUrl: './projects-dialog.component.html',
  styleUrls: ['./projects-dialog.component.sass']
})
export class ProjectsDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ProjectsDialogComponent>) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  addProject(): void {}

  downloadTemplate(): void {}

  importFile(): void {}
}
