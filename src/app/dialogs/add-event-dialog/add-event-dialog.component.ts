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
  OTHER_SUBACTIVITIES
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
  DAILY = 'Zilnic',
  WEEKLY = 'Saptamanal',
  MONTHLY = 'Lunar',
  YEARLY = 'Anual'
}

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' },
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

  activities: string[] = [];
  subactivities: string[] = [];
  dialogTitle = 'Adauga un eveniment';
  id?: string | number | undefined;
  events: IEvent[];
  recurrent?: RECURRENT;
  recurrentEndingDate = new Date();
  recurrentEnding = '';
  weekendsToo = false;
  typeMessage = '';
  type = '';

  weeklyRecurrentDateFilter = (date: Date | null): boolean => {
    return this.recurrent !== RECURRENT.WEEKLY || date?.getDay() === this.data.date?.getDay();
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
    private notificationHelper: NotificationHelper
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
      this.dialogTitle = 'Editeaza eveniment';

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

      this.description = event.description;
      this.id = event.id;
    }
    this.getDayEvents();

    if (this.isEmployee()) {
      ACTIVITIES.forEach((activity) => this.activities.push(activity));
    } else {
      this.activities = ['Activitate didactica'];
      this.activity = 'Activitate didactica';
      this.subactivities = COLLABORATOR_SUBACTIVITIES;
    }
  }

  getDayEvents(): void {
    this.eventService
      .getAll(this.data.date as Date, { for: 'day' })
      .pipe(
        map((result: []) => {
          return this.calendarEventsHelper.addEvents(result);
        })
      )
      .toPromise()
      .then(
        (events) => {
          this.events = events;
          if (this.data.setStartHour) {
            this.startHour = this.startHours()[0].value;
            this.endHour = this.endHours()[0].value;
          }
          if (this.activity) {
            this.setType();
          }
          this.setActivitiesForBasic();
        },
        () => this.cancel()
      );
  }

  setSelectedCourse(data: { selected: ICourse; courses: ICourse[] }): void {
    this.activity = 'Activitate didactica';
    this.subactivities = this.type === 'plata cu ora' ? COLLABORATOR_SUBACTIVITIES : COURSE_SUBACTIVITIES;
    this.subactivity = 'Curs';
    this.entities = data.courses;
    this.entity = data.selected;
  }

  setSelectedProject(data: { selected: IProject; projects: IProject[] }): void {
    this.activity = 'Proiect';
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
    return this.validStartHoursHelper.setStartHours(
      this.events,
      (this.entity as IProject)?.restricted_start_hour,
      isEditEvent ? endHour - startHour : undefined,
      isEditEvent ? this.data.event : undefined
    );
  }

  endHours(): Hour[] {
    if (!this.events) {
      return [];
    }

    const availableHours: Hour[] = [];
    HOURS.slice((this.startHour as number) + 1, HOURS.length).forEach((hour) => availableHours.push(hour));
    let endHours: Hour[] = [];
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

    if (this.type === 'norma de baza') {
      const availableBasicHours = 8 - this.getBasicHours();
      if (endHours.length > availableBasicHours) {
        endHours.splice(availableBasicHours);
      }
    }

    const projectRestrictedHour = (this.entity as IProject)?.restricted_end_hour;
    if (projectRestrictedHour) {
      while (endHours[endHours.length - 1].value > projectRestrictedHour) {
        endHours = endHours.splice(0, endHours.length - 1);
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
      description: this.description,
      id: this.id,
      recurrent: this.recurrent,
      recurrentDate: this.recurrentEndingDate,
      weekendsToo: this.weekendsToo,
      type: this.type
    };
  }

  dateChanged(): void {
    this.getDayEvents();
  }

  activitySelected(subactivity?: string, entity?: ICourse | IProject): void {
    if (this.events) {
      this.setType();
    }

    this.entity = undefined;
    this.subactivity = subactivity;
    switch (this.activity) {
      case 'Activitate didactica': {
        this.subactivities = this.type === 'plata cu ora' ? COLLABORATOR_SUBACTIVITIES : COURSE_SUBACTIVITIES;
        break;
      }
      case 'Proiect': {
        this.getProjects(entity);
        break;
      }
      case 'Concediu': {
        this.subactivities = HOLIDAYS;
        break;
      }
      case 'Alta activitate': {
        this.subactivities = OTHER_SUBACTIVITIES;
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
    if (this.activity === 'Activitate didactica') {
      this.getCourses(entity);
    }
    if (this.events) {
      this.setType();
    }
  }

  addNewEntity(): void {
    if (this.activity === 'Activitate didactica') {
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
            this.notificationHelper.openNotification('Cursul a fost adaugat cu succes!', 'success');
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
            this.notificationHelper.openNotification('Proiectul a fost adaugat cu succes!', 'success');
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
      (this.activity !== 'Proiect' && !this.subactivity) ||
      (this.activity !== 'Alta activitate' && this.activity !== 'Concediu' && !this.entity)
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
    return this.data.date as Date;
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
    return this.recurrent === RECURRENT.WEEKLY;
  }

  isEditMode(): boolean {
    return this.id !== undefined && this.id !== null && !this.data.course && !this.data.project;
  }

  isEmployee(): boolean {
    return JSON.parse(localStorage.getItem('user') as string).type === 'Angajat';
  }

  setType(): void {
    if (!this.isEmployee()) {
      this.type = 'plata cu ora';
    } else {
      const hours = this.getBasicHours();
      if (this.activity === 'Proiect') {
        this.setProjectType(hours);
      } else if (hours < 8) {
        this.setBasicType(hours);
      } else {
        this.setHourPay();
      }
    }
  }

  setProjectType(hours: number): void {
    if (!this.entity) {
      this.typeMessage = this.type = '';
      return;
    }

    const entity = this.entity as IProject;
    this.type = 'proiect';
    this.typeMessage = `Aveti pontate ${hours} ore pe proiectul ${entity.name} pentru luna ${this.data.date?.toLocaleString('ro-RO', {
      month: 'long'
    })} ${this.data.date?.getFullYear()}.`;
    if (entity.hours_per_month) {
      if (entity.hours_per_month - hours >= 0) {
        this.typeMessage += ` Mai aveti ${entity.hours_per_month - hours} ore ramase.`;
      } else {
        this.typeMessage += ` Ati depasit deja norma lunara de ${entity.hours_per_month}.`;
      }
    } else {
      this.typeMessage += ` Nu aveti norma lunara de ore pe acest proiect.`;
    }
  }

  setBasicType(hours: number): void {
    this.type = 'norma de baza';
    this.typeMessage = `Aveti pontate ${hours} ore din norma de baza in data de ${this.data.date
      ?.toLocaleDateString()
      .replace(/\/(.*)\//, '.$1.')}.`;
    this.typeMessage += ` Mai aveti ${8 - hours} ore ramase.`;
  }

  setHourPay(): void {
    this.type = 'plata cu ora';
    this.typeMessage = `Aveti deja pontate 8 ore din norma de baza si ${this.getHourPayHours()} ore in regim de plata cu ora in data de ${this.data.date
      ?.toLocaleDateString()
      .replace(/\/(.*)\//, '.$1.')}.`;
    this.typeMessage += ' Toate orele ce le veti adauga de acum inainte in aceasta zi vor intra la plata cu ora.';
  }

  getBasicHours(): number {
    let events: IEvent[];
    if (this.activity === 'Proiect' && this.entity) {
      events = this.events.filter((event) => event.type === 'proiect' && event.entity?.id === this.entity?.id);
    } else if (this.activity === 'Concediu') {
      events = [];
    } else {
      events = this.events.filter((event) => event.type === 'norma de baza');
    }
    let sum = 0;
    events.forEach((event) => (sum += (event.end.getHours() === 0 ? 24 : event.end.getHours()) - event.start.getHours()));

    if (this.data.event && this.data.event.type === 'norma de baza') {
      sum -= (this.data.event.end.getHours() === 0 ? 24 : this.data.event.end.getHours()) - this.data.event.start.getHours();
    }

    return sum;
  }

  getHourPayHours(): number {
    const events = this.events.filter((event) => event.type === 'plata cu ora');
    let sum = 0;
    events.forEach((event) => (sum += (event.end.getHours() === 0 ? 24 : event.end.getHours()) - event.start.getHours()));

    if (this.data.event && this.data.event.type === 'plata cu ora') {
      sum -= (this.data.event.end.getHours() === 0 ? 24 : this.data.event.end.getHours()) - this.data.event.start.getHours();
    }

    return sum;
  }

  entitySelected(): void {
    if (this.events) {
      this.setType();
    }
    this.startHour = this.startHours()[0].value;
    this.endHour = this.endHours()[0].value;
  }

  setActivitiesForBasic(): void {
    if (this.getBasicHours() === 8) {
      const index = this.activities.indexOf('Alta activitate');
      if (index !== -1) {
        this.activities.splice(index, 1);
      }
      if (this.activity === 'Activitate didactica') {
        this.subactivities = COLLABORATOR_SUBACTIVITIES;
      }
    }
  }
}
