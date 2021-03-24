import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../models/user.model';

interface Data {
  user: IUser;
}

@Component({
  selector: 'app-personal-information-dialog',
  templateUrl: './personal-information-dialog.component.html',
  styleUrls: ['./personal-information-dialog.component.sass']
})
export class PersonalInformationDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<PersonalInformationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {}

  ngOnInit(): void {}

  saveUser(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}
