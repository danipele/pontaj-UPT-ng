import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie';
import { NotificationHelper } from '../../helpers/notification-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  resetPassOn = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService
  ) {
    this.formGroup = new FormGroup({
      userEmail: new FormControl(),
      userPassword: new FormControl()
    });
  }

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe(
      (user) => {
        if (user) {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        if (error.status !== 401) {
          this.notificationHelper.openNotification(error.message, 'error');
        }
      }
    );
  }

  login(): void {
    const params = {
      email: this.formGroup.controls.userEmail.value,
      password: this.formGroup.controls.userPassword.value
    };

    this.loginService.login(params).subscribe(
      (result) => {
        if (result.success === true) {
          this.cookieService.put('auth_token', result.auth_token);
          localStorage.setItem('user', JSON.stringify(result.user));
          if (result.user.type === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
          this.notificationHelper.openNotification(this.translateService.instant('login.successMessage'), 'success');
        } else {
          this.notificationHelper.openNotification(result.message, 'error');
        }
      },
      (error) => this.notificationHelper.notifyWithError(error)
    );
  }

  resetPassword(): void {
    this.resetPassOn = true;
  }

  sendEmail(): void {
    this.resetPassOn = false;
    const email = this.formGroup.controls.userEmail.value;
    this.userService.resetPassword(email).subscribe(
      (result) => {
        this.notificationHelper.openNotification(this.translateService.instant('login.resetEmailSentMessage', { email }), 'success');
      },
      (error) => this.notificationHelper.notifyWithError(error)
    );
  }

  signup(): void {
    this.router.navigate(['/signup']);
  }

  setEnglish(): void {
    this.translateService.use('en');
    this.cookieService.put('lang', 'en');
  }

  setRomanian(): void {
    this.translateService.use('ro');
    this.cookieService.put('lang', 'ro');
  }

  goBackFromReset(): void {
    this.resetPassOn = false;
  }
}
