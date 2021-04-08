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
      projectHoursPerMonth: new FormControl(),
      projectRestrictedStartHour: new FormControl(),
      projectRestrictedEndHour: new FormControl(),
      projectDescription: new FormControl()
    });
    if (data) {
      this.formGroup.controls.projectName.setValue(data.name);
      this.formGroup.controls.projectHoursPerMonth.setValue(data.hours_per_month);
      this.formGroup.controls.projectRestrictedStartHour.setValue(data.restricted_start_hour);
      this.formGroup.controls.projectRestrictedEndHour.setValue(data.restricted_end_hour);
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
        hours_per_month: this.formGroup.controls.projectHoursPerMonth.value,
        restricted_start_hour: this.formGroup.controls.projectRestrictedStartHour.value,
        restricted_end_hour: this.formGroup.controls.projectRestrictedEndHour.value,
        description: this.formGroup.controls.projectDescription.value
      }
    };
  }

  notAllFieldsAreFilled(): boolean {
    return !this.formGroup.controls.projectName.value;
  }
}
