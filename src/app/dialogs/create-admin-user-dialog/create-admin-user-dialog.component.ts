import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-admin-user-dialog',
  templateUrl: './create-admin-user-dialog.component.html',
  styleUrls: ['./create-admin-user-dialog.component.sass']
})
export class CreateAdminUserDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateAdminUserDialogComponent>) {
    this.formGroup = new FormGroup({
      userEmail: new FormControl(),
      userPassword: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl()
    });
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  sendData(): {} {
    return {
      email: this.formGroup.controls.userEmail.value,
      password: this.formGroup.controls.userPassword.value,
      first_name: this.formGroup.controls.firstName.value,
      last_name: this.formGroup.controls.lastName.value,
      type: 'Admin'
    };
  }

  notAllFieldsAreFilled(): boolean {
    return (
      !this.formGroup.controls.userEmail.value ||
      !this.formGroup.controls.userPassword.value ||
      !this.formGroup.controls.firstName.value ||
      !this.formGroup.controls.lastName.value
    );
  }
}
