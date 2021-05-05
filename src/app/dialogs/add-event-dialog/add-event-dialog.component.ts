import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';
import {
  ACTIVITIES,
  COLLABORATOR_SUBACTIVITIES,
  COURSE_SUBACTIVITIES,
  HOLIDAYS,
  IEvent,
  NO_HOLIDAY_ACTIVITIES,
  OTHER_SUBACTIVITIES,
  WEEKEND_ACTIVITIES
} from '../../models/event.model';
import { AddEditCourseDialogComponent } from '../add-edit-course-dialog/add-edit-course-dialog.component';
import { AddEditProjectDialogComponent } from '../add-edit-project-dialog/add-edit-project-dialog.component';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { EventService } from '../../services/event.service';
import { map } from 'rxjs/operators';
import { Hour, HOURS, ValidStartHoursHelper } from '../../helpers/valid-start-hours-helper';
import { NotificationHelper } from '../../helpers/notification-helper';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { LanguageHelper, LocaleIdFactory } from '../../helpers/language-helper';
import { EventDescriptionHelper } from '../../helpers/event-description-helper';

interface Data {
  date?: Date;
  course?: {
    selected: ICourse;
    courses: ICourse[];
  };
  project?: {
    selected: IProject;
    projects: IProject[];
  };
  event?: IEvent;
  setStartHour: boolean;
}

export enum RECURRENT {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  EVERY_OTHER_WEEK = 'everyOtherWeek',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useFactory: LocaleIdFactory, deps: [LanguageHelper] },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class AddEventDialogComponent {
  startHour?: number;
  endHour?: number;
  allDay = false;
  activity: string;
  subactivity: string | undefined;
  entities: ICourse[] | IProject[] = [];
  entity: ICourse | IProject | undefined;
  description: string | undefined = '';
  collaboratorDescription = {
    materials: '',
    onlineSession: '',
    otherModalities: ''
  };

  activities: string[] = [];
  subactivities: string[] = [];
  dialogTitle = this.translateService.instant('event.add');
  id?: string | number | undefined;
  events: IEvent[] = [];
  recurrent?: RECURRENT;
  recurrentEndingDate = new Date();
  recurrentEnding = '';
  weekendsToo = false;
  typeMessage: string | undefined = '';
  type: string | undefined = '';

  weeklyRecurrentDateFilter = (date: Date | null): boolean => {
    return this.setWeekFilter(date);
  }

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private courseService: CourseService,
    public dialog: MatDialog,
    private calendarEventsHelper: CalendarEventsHelper,
    private projectService: ProjectService,
    private eventService: EventService,
    private validStartHoursHelper: ValidStartHoursHelper,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService,
    private eventDescriptionHelper: EventDescriptionHelper
  ) {
    if (data.date) {
      this.startHour = data.date.getHours();
      this.endHour = this.startHour + 1;
      data.date.setMinutes(0);
      data.date.setSeconds(0);
      data.date.setMilliseconds(0);
    }
    if (data.course) {
      this.setSelectedCourse(data.course);
    }
    if (data.project) {
      this.setSelectedProject(data.project);
    }
    if (this.data.event) {
      this.dialogTitle = this.translateService.instant('event.edit');

      const event = this.data.event;
      this.data.date = event.start;
      this.startHour = event.start.getHours();

      if (event.start.getHours() === 8 && event.end.getHours() === 22) {
        this.allDay = true;
      }
      this.endHour = event.end?.getHours();

      this.activity = event.activity;
      this.activitySelected(event.subactivity, event.entity);
      this.subactivitySelected(event.entity);

      if (COLLABORATOR_SUBACTIVITIES.includes(this.subactivity as string)) {
        this.collaboratorDescription = this.eventDescriptionHelper.setEventDescription(this.data.event.description as string);
      } else {
        this.description = event.description;
      }
      this.id = event.id;
    }
    this.getDayEvents();
  }

  getDayEvents(): void {
    this.eventService
      .getAll(this.data.date as Date, { for: 'day' })
      .pipe(
        map((result: []) => {
          return result;
        })
      )
      .toPromise()
      .then(
        (events) => {
          events.forEach((event) => this.events.push(this.calendarEventsHelper.createEvent(event)));
          if (this.activity) {
            this.setType();
          }
          this.setActivities();
          this.setActivitiesForBasic();
        },
        () => this.cancel()
      );
  }

  setSelectedCourse(data: { selected: ICourse; courses: ICourse[] }): void {
    this.activity = 'courseHour';
    this.subactivities = this.type === 'hourly payment' ? COLLABORATOR_SUBACTIVITIES : COURSE_SUBACTIVITIES;
    this.subactivity = 'course';
    this.entities = data.courses;
    this.entity = data.selected;
  }

  setSelectedProject(data: { selected: IProject; projects: IProject[] }): void {
    this.activity = 'project';
    this.entities = data.projects;
    this.entity = data.selected;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  startHours(): Hour[] {
    if (!this.events) {
      return [];
    }

    const startHour = this.data.event?.start.getHours() as number;
    const endHour = this.data.event?.end.getHours() === 0 ? 24 : (this.data.event?.end.getHours() as number);
    const isEditEvent = this.id && !this.data.course && !this.data.project;
    if (this.events.filter((event) => event.allDay).length === 1) {
      return this.validStartHoursHelper.setAllHours(
        isEditEvent ? endHour - startHour : undefined,
        (this.entity as IProject)?.restricted_start_hour,
        (this.entity as IProject)?.restricted_end_hour
      );
    } else {
      return this.validStartHoursHelper.setStartHours(
        this.events,
        (this.entity as IProject)?.restricted_start_hour,
        (this.entity as IProject)?.restricted_end_hour,
        isEditEvent ? endHour - startHour : undefined,
        isEditEvent ? this.data.event : undefined
      );
    }
  }

  endHours(): Hour[] {
    if (!this.events) {
      return [];
    }

    const availableHours: Hour[] = [];
    HOURS.slice((this.startHour as number) + 1, HOURS.length).forEach((hour) => availableHours.push(hour));
    const endHours: Hour[] = [];
    for (const hour of availableHours) {
      endHours.push(hour);
      let startsAnEvent = false;
      for (const event of this.events) {
        if (event.start.getHours() === hour.value) {
          startsAnEvent = true;
          break;
        }
      }
      if (startsAnEvent) {
        break;
      }
    }

    if (this.type === 'basic norm') {
      const availableBasicHours = 8 - this.getBasicHours();
      if (endHours.length > availableBasicHours) {
        endHours.splice(availableBasicHours);
      }
    }

    const projectRestrictedHour = (this.entity as IProject)?.restricted_end_hour;
    if (projectRestrictedHour) {
      while (endHours[endHours.length - 1].value > projectRestrictedHour) {
        endHours.splice(endHours.length - 1);
      }
    }

    return endHours;
  }

  setAllDay(event: any): void {
    this.allDay = event;
  }

  sendData(): {} {
    return {
      date: this.data.date,
      startHour: this.allDay ? 0 : this.startHour,
      endHour: this.allDay ? 24 : this.endHour,
      activity: this.activity,
      subactivity: this.subactivity,
      entity: this.entity,
      description: COLLABORATOR_SUBACTIVITIES.includes(this.subactivity as string)
        ? this.eventDescriptionHelper.setCollaboratorDescription(this.collaboratorDescription)
        : this.description,
      id: this.id,
      recurrent: this.recurrent,
      recurrentDate: this.recurrentEndingDate,
      weekendsToo: this.weekendsToo,
      type: this.type
    };
  }

  dateChanged(): void {
    this.getDayEvents();
    this.allDay = this.activity === 'holidays';
  }

  activitySelected(subactivity?: string, entity?: ICourse | IProject): void {
    if (this.events) {
      this.setType();
    }

    this.entity = undefined;
    this.subactivity = subactivity;
    switch (this.activity) {
      case 'courseHour': {
        this.subactivities = this.type === 'hourly payment' ? COLLABORATOR_SUBACTIVITIES : COURSE_SUBACTIVITIES;
        this.allDay = false;
        break;
      }
      case 'project': {
        this.getProjects(entity);
        this.allDay = false;
        break;
      }
      case 'holidays': {
        this.subactivities = HOLIDAYS;
        this.allDay = true;
        break;
      }
      case 'otherActivity': {
        this.subactivities = OTHER_SUBACTIVITIES;
        this.allDay = false;
        break;
      }
    }
  }

  getCourses(entity?: ICourse | IProject | undefined): void {
    this.courseService.getAll().subscribe(
      (result) => {
        this.entities = result;
        if (entity) {
          this.setEntity(entity);
        }
      },
      (error) => {
        this.cancel();
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  getProjects(entity?: ICourse | IProject | undefined): void {
    this.projectService.getAll().subscribe(
      (result) => {
        this.entities = result;
        if (entity) {
          this.setEntity(entity);
        }
      },
      (error) => {
        this.cancel();
        this.notificationHelper.notifyWithError(error);
      }
    );
  }

  setEntity(entity: ICourse | IProject): void {
    for (const e of this.entities) {
      if (e.id === entity.id) {
        this.entity = e;
        break;
      }
    }
  }

  subactivitySelected(entity?: ICourse | IProject | undefined): void {
    this.entity = undefined;
    if (this.activity === 'courseHour') {
      this.getCourses(entity);
    }
    if (this.events) {
      this.setType();
    }
  }

  addNewEntity(): void {
    if (this.activity === 'courseHour') {
      this.addNewCourse();
    } else {
      this.addNewProject();
    }
  }

  addNewCourse(): void {
    const dialogRef = this.dialog.open(AddEditCourseDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseService.add(result).subscribe(
          (coursesResult) => {
            this.getCourses(coursesResult[0]);
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.course'),
                action: this.translateService.instant('message.sg.added')
              }),
              'success'
            );
          },
          (error) => {
            this.cancel();
            this.notificationHelper.notifyWithError(error);
          }
        );
      }
    });
  }

  addNewProject(): void {
    const dialogRef = this.dialog.open(AddEditProjectDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.add(result).subscribe(
          (projectsResult) => {
            this.getProjects(projectsResult[0]);
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectType: this.translateService.instant('message.art.project'),
                action: this.translateService.instant('message.sg.added')
              }),
              'success'
            );
          },
          (error) => {
            this.cancel();
            this.notificationHelper.notifyWithError(error);
          }
        );
      }
    });
  }

  notAllFieldsAreFilled(): boolean {
    return (
      !this.activity ||
      (this.activity !== 'project' && !this.subactivity) ||
      (this.activity !== 'otherActivity' && this.activity !== 'holidays' && !this.entity) ||
      (COLLABORATOR_SUBACTIVITIES.includes(this.subactivity as string) &&
        (!this.collaboratorDescription.materials ||
          !this.collaboratorDescription.onlineSession ||
          !this.collaboratorDescription.otherModalities))
    );
  }

  recurrentValues(): string[] {
    return Object.values(RECURRENT);
  }

  recurrentSelected(): boolean {
    return this.recurrent !== undefined;
  }

  resetRecurrent(): void {
    this.recurrent = undefined;
    this.recurrentEndingDate = new Date();
  }

  getMinDate(): Date {
    const minDate = new Date(this.data.date as Date);
    if (this.recurrent === RECURRENT.YEARLY) {
      minDate.setFullYear(minDate.getFullYear() + 1);
    } else if (this.recurrent === RECURRENT.MONTHLY) {
      minDate.setMonth(minDate.getMonth() + 1);
    } else if (this.recurrent === RECURRENT.EVERY_OTHER_WEEK) {
      minDate.setDate(minDate.getDate() + 14);
    } else if (this.recurrent === RECURRENT.WEEKLY) {
      minDate.setDate(minDate.getDate() + 7);
    } else {
      minDate.setDate(minDate.getDate() + 1);
    }
    return minDate;
  }

  yearSelected(event: any, picker: MatDatepicker<Date>): void {
    this.dateSelected(RECURRENT.YEARLY, event, picker);
  }

  monthSelected(event: any, picker: MatDatepicker<Date>): void {
    this.dateSelected(RECURRENT.MONTHLY, event, picker);
  }

  daySelected(event: any, picker: MatDatepicker<Date>): void {
    this.dateSelected(RECURRENT.DAILY, event.value, picker);
  }

  dateSelected(recurrent: RECURRENT, event: any, picker: MatDatepicker<Date>): void {
    this.recurrentEndingDate = event;
    if (this.recurrent === recurrent) {
      this.recurrentEndingDate = new Date(this.recurrentEndingDate);
      picker.close();
    }
  }

  setRecurrentDate(): void {
    const date = new Date(this.data.date as Date);
    switch (this.recurrent) {
      case RECURRENT.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
      case RECURRENT.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case RECURRENT.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case RECURRENT.DAILY:
        date.setDate(date.getDate() + 1);
        break;
      case RECURRENT.EVERY_OTHER_WEEK:
        date.setDate(date.getDate() + 14);
    }
    this.recurrentEndingDate = date;
  }

  setRecurrentEnding(value: string): void {
    this.recurrentEnding = value;
  }

  setWeekendsToo(event: boolean): void {
    this.weekendsToo = event;
  }

  isWeeklyRecurrent(): boolean {
    return this.recurrent === RECURRENT.WEEKLY || this.recurrent === RECURRENT.EVERY_OTHER_WEEK;
  }

  setWeekFilter(date: Date | null): boolean {
    if (this.recurrent === RECURRENT.WEEKLY) {
      return date?.getDay() === this.data.date?.getDay();
    } else if (this.recurrent === RECURRENT.EVERY_OTHER_WEEK) {
      return date?.getDay() === this.data.date?.getDay() && moment(date).week() % 2 === moment(this.data.date).week() % 2;
    }
    return true;
  }

  isEditMode(): boolean {
    return this.id !== undefined && this.id !== null && !this.data.course && !this.data.project;
  }

  isEmployee(): boolean {
    return JSON.parse(localStorage.getItem('user') as string).type === 'employee';
  }

  setType(): void {
    if (!this.isEmployee()) {
      this.type = 'hourly payment';
    } else {
      const hours = this.getBasicHours();
      if (this.activity === 'project') {
        this.setProjectType();
      } else if (this.activity === 'holidays') {
        this.typeMessage = undefined;
        this.type = 'holidays';
      } else if (hours < 8 && !this.isWeekend()) {
        this.setBasicType(hours);
      } else {
        this.setHourPay();
      }
    }
  }

  setProjectType(): void {
    if (!this.entity) {
      this.typeMessage = this.type = '';
      return;
    }

    this.eventService.projectHoursPerMonth({ date: this.data.date, project: this.entity.id }).subscribe((hours) => {
      const entity = this.entity as IProject;
      this.type = 'project';
      this.typeMessage = this.translateService.instant('message.eventType.recordedProjectHours', {
        hours,
        projectName: entity.name,
        month: (this.data.date as Date).toLocaleString('ro-RO', { month: 'long' }) + ' ' + this.data.date?.getFullYear()
      });
      if (entity.hours_per_month) {
        if (entity.hours_per_month - hours >= 0) {
          this.typeMessage += this.translateService.instant('message.eventType.hoursLeft', { hours: entity.hours_per_month - hours });
        } else {
          this.typeMessage += this.translateService.instant('message.eventType.monthlyNormProject', { hours: entity.hours_per_month });
        }
      } else {
        this.typeMessage += this.translateService.instant('message.eventType.noNormProject');
      }
    });
  }

  setBasicType(hours: number): void {
    this.type = 'basic norm';
    this.typeMessage = this.translateService.instant('message.eventType.recordedBasicNorm', {
      hours,
      date: this.data.date?.toLocaleDateString().replace(/\/(.*)\//, '.$1.')
    });
    this.typeMessage += this.translateService.instant('message.eventType.hoursLeft', { hours: 8 - hours });
  }

  setHourPay(): void {
    this.type = 'hourly payment';
    if (this.isWeekend()) {
      this.typeMessage = this.translateService.instant('message.eventType.recordedHourlyPayment', {
        hours: this.getHourPayHours(),
        date: this.data.date?.toLocaleDateString().replace(/\/(.*)\//, '.$1.')
      });
    } else {
      this.typeMessage = this.translateService.instant('message.eventType.recordedBasicAndHourly', {
        hours: this.getHourPayHours(),
        date: this.data.date?.toLocaleDateString().replace(/\/(.*)\//, '.$1.')
      });
      this.typeMessage += this.translateService.instant('message.eventType.onlyHourlyPaidHours');
    }
  }

  getBasicHours(): number {
    let events: IEvent[];
    if (this.activity === 'otherActivity' || this.activity === 'courseHour') {
      events = this.events.filter((event) => event.type === 'basic norm');

      let sum = 0;
      events.forEach((event) => (sum += (event.end.getHours() === 0 ? 24 : event.end.getHours()) - event.start.getHours()));

      if (this.data.event && this.data.event.type === 'basic norm') {
        sum -= (this.data.event.end.getHours() === 0 ? 24 : this.data.event.end.getHours()) - this.data.event.start.getHours();
      }

      return sum;
    }

    return 0;
  }

  getHourPayHours(): number {
    const events = this.events.filter((event) => event.type === 'hourly payment');
    let sum = 0;
    events.forEach((event) => (sum += (event.end.getHours() === 0 ? 24 : event.end.getHours()) - event.start.getHours()));

    if (this.data.event && this.data.event.type === 'hourly payment') {
      sum -= (this.data.event.end.getHours() === 0 ? 24 : this.data.event.end.getHours()) - this.data.event.start.getHours();
    }

    return sum;
  }

  entitySelected(): void {
    if (this.events) {
      this.setType();
    }
    if ((this.entity as IProject)?.restricted_start_hour) {
      this.startHour = this.startHours()[0].value;
      this.endHour = this.endHours()[0].value;
    }
  }

  setActivitiesForBasic(): void {
    if (this.getBasicHours() === 8) {
      const index = this.activities.indexOf('otherActivity');
      if (index !== -1) {
        this.activities.splice(index, 1);
      }
      if (this.activity === 'courseHour') {
        this.subactivities = COLLABORATOR_SUBACTIVITIES;
      }
    }
  }

  isWeekend(): boolean {
    return this.data.date?.getDay() === 6 || this.data.date?.getDay() === 0;
  }

  setActivities(): void {
    this.activities = [];
    if (this.isEmployee()) {
      if (this.events.filter((event) => event.allDay).length === 1) {
        if (this.id) {
          this.activities = [this.data.event?.activity as string];
        } else {
          this.activities = ['project'];
          this.activity = 'project';
          this.getProjects();
        }
      } else if (this.isWeekend()) {
        WEEKEND_ACTIVITIES.forEach((activity) => this.activities.push(activity));
        this.type = 'hourly payment';
      } else if (this.events.filter((event) => event.type !== 'project').length > 0) {
        NO_HOLIDAY_ACTIVITIES.forEach((activity) => this.activities.push(activity));
      } else {
        ACTIVITIES.forEach((activity) => this.activities.push(activity));
      }
    } else {
      this.activities = ['courseHour'];
      this.activity = 'courseHour';
      this.subactivities = COLLABORATOR_SUBACTIVITIES;
    }
  }

  isCollaboratorSubactivity(): boolean {
    if (this.subactivity) {
      return COLLABORATOR_SUBACTIVITIES.includes(this.subactivity);
    } else {
      return false;
    }
  }
}
