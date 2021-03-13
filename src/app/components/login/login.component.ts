import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  requestInProgress = false;
  error = '';

  constructor(private loginService: LoginService, private router: Router) {
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
        if (result.type === 'admin') {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.error = result.message;
      }
    });
  }
}
