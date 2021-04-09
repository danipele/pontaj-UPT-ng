import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';
import { IEvent } from '../../models/event.model';
import { AddEditCourseDialogComponent } from '../add-edit-course-dialog/add-edit-course-dialog.component';
import { AddEditProjectDialogComponent } from '../add-edit-project-dialog/add-edit-project-dialog.component';

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
}

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.sass']
})
export class AddEventDialogComponent {
  startHour: number;
  endHour: number;
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

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private courseService: CourseService,
    public dialog: MatDialog,
    private projectService: ProjectService
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
    return this.HOURS.slice(0, this.HOURS.length - 1);
  }

  endHours(): Hour[] {
    return this.HOURS.slice(this.startHour - 7, this.HOURS.length);
  }

  setAllDay(event: any): void {
    this.allDay = event;
  }

  sendData(): {} {
    return {
      date: this.data.date,
      startHour: this.allDay ? 8 : this.startHour,
      endHour: this.allDay ? 22 : this.endHour,
      activity: this.activity,
      subactivity: this.subactivity,
      entity: this.entity,
      description: this.description,
      id: this.id
    };
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
}
