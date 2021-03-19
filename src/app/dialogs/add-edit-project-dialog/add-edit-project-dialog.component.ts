import { Component, Inject, OnInit } from '@angular/core';
import { IProject } from '../../models/project.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-project-dialog',
  templateUrl: './add-edit-project-dialog.component.html',
  styleUrls: ['./add-edit-project-dialog.component.sass']
})
export class AddEditProjectDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddEditProjectDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IProject) {
    this.formGroup = new FormGroup({
      projectName: new FormControl(),
      projectDescription: new FormControl()
    });
    if (data) {
      this.formGroup.controls.projectName.setValue(data.name);
      this.formGroup.controls.projectDescription.setValue(data.description);
    }
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  sendProject(): {} {
    return {
      project: {
        id: this.data.id,
        name: this.formGroup.controls.projectName.value,
        description: this.formGroup.controls.projectDescription.value
      }
    };
  }
}
