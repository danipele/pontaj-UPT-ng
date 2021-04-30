import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';
import { LanguageHelper } from '../../helpers/language-helper';

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
    private cookieService: CookieService,
    private languageHelper: LanguageHelper
  ) {
    this.language = this.languages.find((language) => language === this.cookieService.get('lang')) as string;
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.languageHelper.changeLanguage(this.language);
    this.cancel();
  }
}
