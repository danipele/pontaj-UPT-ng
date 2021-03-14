import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'pontaj-UPT-ng';

  ngOnInit(): void {
    moment.updateLocale('ro', {
      week: {
        dow: 1,
        doy: 0
      }
    });
  }
}
