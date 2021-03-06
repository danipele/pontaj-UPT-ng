import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWrapper } from '../helpers/http-wrapper';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { NotificationHelper } from '../helpers/notification-helper';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class UserService {
  constructor(
    private httpWrapper: HttpWrapper,
    private http: HttpClient,
    private loginService: LoginService,
    private router: Router,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService
  ) {}

  resetPassword(email: string): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/users/reset_password`, { email }, this.httpWrapper.getAuthOptions());
  }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get(`http://localhost:8000/api/v1/users/authenticated_user`, this.httpWrapper.getAuthOptions());
  }

  updateCurrentUser(params: {}): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/users`, { user: params }, this.httpWrapper.getAuthOptions());
  }

  createUser(params: {}): void {
    this.loginService.signup(params).subscribe(
      (result) => {
        if (result.success === true) {
          if (JSON.parse(localStorage.getItem('user') as string).type === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/login']);
          }
          this.notificationHelper.openNotification('Cont creat cu succes!', 'success');
        } else {
          this.notificationHelper.openNotification(result.error, 'error');
        }
      },
      (error) => {
        if (error.status === 422) {
          this.notificationHelper.openNotification(this.translateService.instant('message.emailAlreadyExists'), 'error');
        } else {
          this.notificationHelper.notifyWithError(error);
        }
      }
    );
  }

  addHolidays(params: {}): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/users/add_holidays`, params, this.httpWrapper.getAuthOptions());
  }
}
