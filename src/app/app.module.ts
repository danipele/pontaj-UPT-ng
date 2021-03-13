import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import localeRo from '@angular/common/locales/ro';
import { registerLocaleData } from '@angular/common';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
registerLocaleData(localeRo);

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [AppComponent, DashboardComponent, TopBarComponent, CalendarHeaderComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    ReactiveFormsModule,
    LaddaModule,
    HttpClientModule
  ],
  providers: [{ provide: LoginService, useClass: LoginService }],
  bootstrap: [AppComponent]
})
export class AppModule {}
