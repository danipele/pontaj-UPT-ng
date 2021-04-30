import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.sass']
})
export class SettingsDialogComponent implements OnInit {
  language: string;
  languages: string[] = ['ro', 'en'];

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) {
    this.language = this.languages.find((language) => language === this.cookieService.get('lang')) as string;
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.translateService.use(this.language);
    this.cookieService.put('lang', this.language);
    this.cancel();
  }
}
