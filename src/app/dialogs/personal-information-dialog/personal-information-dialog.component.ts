import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';

interface Data {
  user: IUser;
}

@Component({
  selector: 'app-personal-information-dialog',
  templateUrl: './personal-information-dialog.component.html',
  styleUrls: ['./personal-information-dialog.component.sass']
})
export class PersonalInformationDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<PersonalInformationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {
    this.formGroup = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl()
    });
    if (data) {
      this.formGroup.controls.firstName.setValue(data.user.first_name);
      this.formGroup.controls.lastName.setValue(data.user.last_name);
    }
  }

  ngOnInit(): void {}

  sendData(): any {
    return {
      first_name: this.formGroup.controls.firstName.value,
      last_name: this.formGroup.controls.lastName.value
    };
  }

  cancel(): void {
    this.dialogRef.close();
  }

  notAllFieldsAreFilled(): boolean {
    return !this.formGroup.controls.firstName.value || !this.formGroup.controls.lastName.value;
  }
}
