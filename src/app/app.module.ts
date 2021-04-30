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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { LOCALE_ID } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddEventDialogComponent } from './dialogs/add-event-dialog/add-event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CoursesDialogComponent } from './dialogs/courses-dialog/courses-dialog.component';
import { ProjectsDialogComponent } from './dialogs/projects-dialog/projects-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { PersonalInformationDialogComponent } from './dialogs/personal-information-dialog/personal-information-dialog.component';
import { UserService } from './services/user.service';
import { SettingsDialogComponent } from './dialogs/settings-dialog/settings-dialog.component';
import { AddEditCourseDialogComponent } from './dialogs/add-edit-course-dialog/add-edit-course-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { CourseService } from './services/course.service';
import { AddEditProjectDialogComponent } from './dialogs/add-edit-project-dialog/add-edit-project-dialog.component';
import { ProjectService } from './services/project.service';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { SignupComponent } from './components/signup/signup.component';
import { HttpWrapper } from './helpers/http-wrapper';
import { CookieModule, CookieService } from 'ngx-cookie';
import { CalendarEventsHelper } from './helpers/calendar-events-helper';
import { EventService } from './services/event.service';
import { EventDialogComponent } from './dialogs/event-dialog/event-dialog.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { DateFormatDirective } from './directives/date-format/date-format.directive';
import { CopyEventsDialogComponent } from './dialogs/copy-events-dialog/copy-events-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CopyEventDialogComponent } from './dialogs/copy-event-dialog/copy-event-dialog.component';
import { ValidStartHoursHelper } from './helpers/valid-start-hours-helper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationHelper } from './helpers/notification-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminComponent } from './components/admin/admin.component';
import { CreateAdminUserDialogComponent } from './dialogs/create-admin-user-dialog/create-admin-user-dialog.component';
import { AddHolidayForEmployeesDialogComponent } from './dialogs/add-holiday-for-employees-dialog/add-holiday-for-employees-dialog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageHelper } from './helpers/language-helper';
registerLocaleData(localeRo);

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TopBarComponent,
    CalendarHeaderComponent,
    LoginComponent,
    AddEventDialogComponent,
    CoursesDialogComponent,
    ProjectsDialogComponent,
    PersonalInformationDialogComponent,
    SettingsDialogComponent,
    AddEditCourseDialogComponent,
    AddEditProjectDialogComponent,
    ConfirmationDialogComponent,
    SignupComponent,
    EventDialogComponent,
    EventsListComponent,
    DateFormatDirective,
    CopyEventsDialogComponent,
    CopyEventDialogComponent,
    AdminComponent,
    CreateAdminUserDialogComponent,
    AddHolidayForEmployeesDialogComponent
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
    FormsModule,
    MatTableModule,
    CookieModule.forRoot(),
    MatSortModule,
    MatPaginatorModule,
    MatGridListModule,
    MatTooltipModule,
    InfiniteScrollModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: LoginService, useClass: LoginService },
    { provide: UserService, useClass: UserService },
    { provide: CourseService, useClass: CourseService },
    { provide: ProjectService, useClass: ProjectService },
    { provide: HttpWrapper, useClass: HttpWrapper },
    { provide: CookieService, useClass: CookieService },
    { provide: CalendarEventsHelper, useClass: CalendarEventsHelper },
    { provide: EventService, useClass: EventService },
    { provide: ValidStartHoursHelper, useClass: ValidStartHoursHelper },
    { provide: NotificationHelper, useClass: NotificationHelper },
    { provide: MatSnackBar, useClass: MatSnackBar },
    { provide: LanguageHelper, useClass: LanguageHelper },
    { provide: LOCALE_ID, useValue: 'ro-RO' }
  ],
  bootstrap: [AppComponent],
  exports: [DateFormatDirective]
})
export class AppModule {}
