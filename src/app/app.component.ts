import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'pontaj-UPT-ng';

  constructor(translate: TranslateService, cookieService: CookieService) {
    translate.addLangs(['en', 'ro']);
    translate.use(cookieService.get('lang'));
  }

  ngOnInit(): void {
    moment.updateLocale('ro', {
      week: {
        dow: 1,
        doy: 0
      }
    });
  }
}
