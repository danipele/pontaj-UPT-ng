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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { LOCALE_ID } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddTimelineDialogComponent } from './dialogs/add-timeline-dialog/add-timeline-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CoursesDialogComponent } from './dialogs/courses-dialog/courses-dialog.component';
import { ProjectsDialogComponent } from './dialogs/projects-dialog/projects-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
registerLocaleData(localeRo);

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TopBarComponent,
    CalendarHeaderComponent,
    LoginComponent,
    AddTimelineDialogComponent,
    CoursesDialogComponent,
    ProjectsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    ReactiveFormsModule,
    LaddaModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatMenuModule,
    FormsModule
  ],
  providers: [
    { provide: LoginService, useClass: LoginService },
    { provide: LOCALE_ID, useValue: 'ro-RO' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
