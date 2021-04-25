import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationHelper } from '../../helpers/notification-helper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {
  TYPES: string[] = ['Angajat', 'Colaborator'];
  formGroup: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private notificationHelper: NotificationHelper
  ) {
    this.formGroup = new FormGroup({
      userEmail: new FormControl(),
      userPassword: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      type: new FormControl()
    });
  }

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe(
      (user) => {
        if (user) {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => this.notificationHelper.notifyWithError(error)
    );
  }

  createAccount(): void {
    const params = {
      email: this.formGroup.controls.userEmail.value,
      password: this.formGroup.controls.userPassword.value,
      first_name: this.formGroup.controls.firstName.value,
      last_name: this.formGroup.controls.lastName.value,
      type: this.formGroup.controls.type.value
    };

    this.userService.createUser(params);
  }

  notAllFieldsAreFilled(): boolean {
    return (
      !this.formGroup.controls.userEmail.value ||
      !this.formGroup.controls.userPassword.value ||
      !this.formGroup.controls.firstName.value ||
      !this.formGroup.controls.lastName.value ||
      !this.formGroup.controls.type.value
    );
  }
}
