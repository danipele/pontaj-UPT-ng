import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  error = '';
  resetPassOn = false;

  constructor(private loginService: LoginService, private router: Router, private userService: UserService) {
    this.formGroup = new FormGroup({
      userEmail: new FormControl(),
      userPassword: new FormControl()
    });
  }

  ngOnInit(): void {}

  login(): void {
    const params = {
      email: this.formGroup.controls.userEmail.value,
      password: this.formGroup.controls.userPassword.value
    };

    this.loginService.login(params).subscribe((result) => {
      if (result.success === 'true') {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = result.message;
      }
    });
  }

  resetPassword(): void {
    this.resetPassOn = true;
  }

  sendEmail(): void {
    this.resetPassOn = false;
    const email = this.formGroup.controls.userEmail.value;
    this.userService.resetPassword(email).subscribe();
  }

  signup(): void {
    this.router.navigate(['/signup']);
  }
}
