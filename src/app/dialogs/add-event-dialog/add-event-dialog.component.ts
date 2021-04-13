import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';
import { IEvent } from '../../models/event.model';
import { AddEditCourseDialogComponent } from '../add-edit-course-dialog/add-edit-course-dialog.component';
import { AddEditProjectDialogComponent } from '../add-edit-project-dialog/add-edit-project-dialog.component';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { EventService } from '../../services/event.service';
import { map } from 'rxjs/operators';

interface Hour {
  displayValue: string;
  value: number;
}

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

  HOURS: Hour[] = [
    { displayValue: '0:00', value: 0 },
    { displayValue: '1:00', value: 1 },
    { displayValue: '2:00', value: 2 },
    { displayValue: '3:00', value: 3 },
    { displayValue: '4:00', value: 4 },
    { displayValue: '5:00', value: 5 },
    { displayValue: '6:00', value: 6 },
    { displayValue: '7:00', value: 7 },
    { displayValue: '8:00', value: 8 },
    { displayValue: '9:00', value: 9 },
    { displayValue: '10:00', value: 10 },
    { displayValue: '11:00', value: 11 },
    { displayValue: '12:00', value: 12 },
    { displayValue: '13:00', value: 13 },
    { displayValue: '14:00', value: 14 },
    { displayValue: '15:00', value: 15 },
    { displayValue: '16:00', value: 16 },
    { displayValue: '17:00', value: 17 },
    { displayValue: '18:00', value: 18 },
    { displayValue: '19:00', value: 19 },
    { displayValue: '20:00', value: 20 },
    { displayValue: '21:00', value: 21 },
    { displayValue: '22:00', value: 22 },
    { displayValue: '23:00', value: 23 },
    { displayValue: '24:00', value: 24 }
  ];

  ACTIVITIES: string[] = ['Activitate didactica', 'Proiect', 'Concediu', 'Alta activitate'];
  COURSE_SUBACTIVITIES: string[] = [
    'Curs',
    'Seminar',
    'Laborator',
    'Ora de proiect',
    'Evaluare',
    'Consultatii',
    'Pregatire pentru activitatea didactica'
  ];
  OTHER_SUBACTIVITIES: string[] = [
    'Indrumare doctoranzi',
    'Implicare neremunerată în problematica societății',
    'Gestiune cooperari',
    'Zile delegatie (Deplasare interna)',
    'Zile delegatie (Deplasare externa)',
    'Plecati cu bursa',
    'Documentare pentru cercetare',
    'Documentare oportunitati de finantare proiecte',
    'Elaborare proiecte de cercetare',
    'Executie proiecte de cercetare',
    'Alte activitati'
  ];
  HOLIDAYS: string[] = [
    'Concediu de odihna',
    'Concediu medical',
    'Concediu crestere copil',
    'Concediu de maternitate',
    'Concediu fara salariu',
    'Absente nemotivate'
  ];
  subactivities: string[] = [];
  dialogTitle = 'Adauga un eveniment';
  id?: string | number | undefined;
  events: IEvent[];
  recurrent?: RECURRENT;
  recurrentEndingDate = new Date();
  recurrentEnding = '';
  weekendsToo = false;

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
    private eventService: EventService
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
      .then((events) => {
        this.events = events;
        if (this.data.setStartHour) {
          this.startHour = this.startHours()[0].value;
          this.endHour = this.endHours()[0].value;
        }
      });
  }

  setSelectedCourse(data: { selected: ICourse; courses: ICourse[] }): void {
    this.activity = 'Activitate didactica';
    this.subactivities = this.COURSE_SUBACTIVITIES;
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
    const startHours: Hour[] = [];
    this.HOURS.slice(0, this.HOURS.length - 1).forEach((hour) => startHours.push(hour));
    if (this.events) {
      this.events.forEach((event) => {
        if (!this.id || this.startHour !== event.start.getHours()) {
          const nrOfHours = (event.end.getHours() === 0 ? 24 : event.end.getHours()) - event.start.getHours();
          const startHour = event.start.getHours();
          let startHourIndex = -1;
          let index = 0;
          for (const hour of startHours) {
            if (hour.value === startHour) {
              startHourIndex = index;
              break;
            }
            index += 1;
          }
          if (startHourIndex !== -1) {
            startHours.splice(startHourIndex, nrOfHours);
          }
        }
      });
    }
    return startHours;
  }

  endHours(): Hour[] {
    const availableHours: Hour[] = [];
    this.HOURS.slice((this.startHour as number) + 1, this.HOURS.length).forEach((hour) => availableHours.push(hour));
    if (this.events) {
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
      return endHours;
    }

    return availableHours;
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
      weekendsToo: this.weekendsToo
    };
  }

  dateChanged(): void {
    this.getDayEvents();
    this.startHour = undefined;
    this.endHour = undefined;
    const a = this.startHours();
  }

  activitySelected(subactivity?: string, entity?: ICourse | IProject): void {
    this.entity = undefined;
    this.subactivity = subactivity;
    switch (this.activity) {
      case 'Activitate didactica': {
        this.subactivities = this.COURSE_SUBACTIVITIES;
        break;
      }
      case 'Proiect': {
        this.getProjects(entity);
        break;
      }
      case 'Concediu': {
        this.subactivities = this.HOLIDAYS;
        break;
      }
      case 'Alta activitate': {
        this.subactivities = this.OTHER_SUBACTIVITIES;
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
      () => this.cancel()
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
      () => this.cancel()
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
          },
          () => this.cancel()
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
          },
          () => this.cancel()
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
}
