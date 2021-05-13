import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
  DIDACTIC_DEGREES: string[] = ['', 'phd', 'assistant', 'lecturer', 'associate', 'professor'];

  constructor(
    public dialogRef: MatDialogRef<PersonalInformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private translateService: TranslateService
  ) {
    this.formGroup = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      department: new FormControl(),
      didacticDegree: new FormControl()
    });
    if (data) {
      this.formGroup.controls.firstName.setValue(data.user.first_name);
      this.formGroup.controls.lastName.setValue(data.user.last_name);
      this.formGroup.controls.department.setValue(data.user.department);
      this.formGroup.controls.didacticDegree.setValue(data.user.didactic_degree);
    }
  }

  ngOnInit(): void {}

  sendData(): {} {
    return {
      first_name: this.formGroup.controls.firstName.value,
      last_name: this.formGroup.controls.lastName.value,
      department: this.formGroup.controls.department.value,
      didactic_degree: this.formGroup.controls.didacticDegree.value
    };
  }

  cancel(): void {
    this.dialogRef.close();
  }

  notAllFieldsAreFilled(): boolean {
    return !this.formGroup.controls.firstName.value || !this.formGroup.controls.lastName.value;
  }

  displayUserType(): string {
    return this.translateService.instant('user.' + this.data.user.type);
  }

  isEmployee(): boolean {
    return JSON.parse(localStorage.getItem('user') as string).type === 'employee';
  }
}
