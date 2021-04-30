import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';

export function LocaleIdFactory(languageHelper: LanguageHelper): string {
  return languageHelper.getLocaleFromLanguage();
}

@Injectable()
export class LanguageHelper {
  constructor(private translateService: TranslateService, private cookieService: CookieService) {}

  getLocaleFromLanguage(): string {
    const lang = this.translateService.currentLang;
    if (lang) {
      return `${lang}-${lang.toUpperCase()}`;
    }
    return 'en-EN';
  }

  changeLanguage(language: string): void {
    this.translateService.use(language);
    this.cookieService.put('lang', language);
    window.location.reload();
  }
}
