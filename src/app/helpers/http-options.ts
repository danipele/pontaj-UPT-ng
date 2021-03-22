import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpOptions {
  constructor(private cookieService: CookieService) {}
  getAuthOptions(): { headers: {} } {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.cookieService.get('auth_token')}`
    });

    return { headers };
  }
}
