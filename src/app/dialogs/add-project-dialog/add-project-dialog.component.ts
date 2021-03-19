import { Component, OnInit } from '@angular/core';
import { IProject } from '../../models/project.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.sass']
})
export class AddProjectDialogComponent implements OnInit {
  project: IProject;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>) {
    this.formGroup = new FormGroup({
      projectName: new FormControl(),
      projectDescription: new FormControl()
    });
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  addProject(): {} {
    return {
      project: {
        name: this.formGroup.controls.projectName.value,
        description: this.formGroup.controls.projectDescription.value
      }
    };
  }
}
