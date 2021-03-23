import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';

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
}

@Component({
  selector: 'app-add-timeline-dialog',
  templateUrl: './add-timeline-dialog.component.html',
  styleUrls: ['./add-timeline-dialog.component.sass']
})
export class AddTimelineDialogComponent {
  startHour: number;
  endHour: number;
  allDay = false;
  activity: string;
  subactivity: string | undefined;
  entities: ICourse[] | IProject[] = [];
  entity: ICourse | IProject | undefined;
  description = '';

  HOURS: Hour[] = [
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
    { displayValue: '22:00', value: 22 }
  ];

  ACTIVITIES: string[] = ['Curs', 'Proiect', 'Concediu', 'Alta activitate'];
  COURSE_SUBACTIVITIES: string[] = [
    'Curs',
    'Seminar',
    'Laborator',
    'Proiect',
    'Evaluare',
    'Consultatii',
    'Pregatire pentru activitatea didactica'
  ];
  PROJECT_SUBACTIVITIES: string[] = [
    'Documentare pentru cercetare',
    'Documentare oportunitati de finantare proiecte',
    'Elaborare proiecte de cercetare',
    'Executie proiecte de cercetare'
  ];
  OTHER_SUBACTIVITIES: string[] = [
    'Indrumare doctoranzi',
    'Implicare neremunerată în problematica societății',
    'Gestiune cooperari',
    'Zile delegatie (Deplasare interna)',
    'Zile delegatie (Deplasare externa)',
    'Plecati cu bursa',
    'Alte activitati'
  ];
  HOLIDAYS: string[] = [
    'Concediu medical',
    'Concediu de odihna',
    'Concediu fara salariu',
    'Concediu crestere copil',
    'Concediu de maternitate',
    'Absente nemotivate'
  ];
  subactivities: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddTimelineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private courseService: CourseService,
    private projectService: ProjectService
  ) {
    if (data.date) {
      if (data.date.getHours() > 8 && data.date.getHours() < 22) {
        this.startHour = data.date.getHours();
        this.endHour = this.startHour + 1;
      } else {
        this.startHour = 8;
        this.endHour = 9;
      }
    }
    if (data.course) {
      this.setSelectedCourse(data.course);
    }
    if (data.project) {
      this.setSelectedProject(data.project);
    }
  }

  setSelectedCourse(data: { selected: ICourse; courses: ICourse[] }): void {
    this.activity = 'Curs';
    this.subactivities = this.COURSE_SUBACTIVITIES;
    this.subactivity = 'Curs';
    this.entities = data.courses;
    this.entity = data.selected;
  }

  setSelectedProject(data: { selected: IProject; projects: IProject[] }): void {
    this.activity = 'Proiect';
    this.subactivities = this.PROJECT_SUBACTIVITIES;
    this.subactivity = 'Documentare pentru cercetare';
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
      endHour: this.allDay ? 23 : this.endHour,
      activity: this.activity,
      subactivity: this.subactivity,
      entity: this.entity,
      description: this.description
    };
  }

  activitySelected(): void {
    this.subactivity = undefined;
    switch (this.activity) {
      case 'Curs': {
        this.subactivities = this.COURSE_SUBACTIVITIES;
        this.getCourses();
        break;
      }
      case 'Proiect': {
        this.subactivities = this.PROJECT_SUBACTIVITIES;
        this.getProjects();
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

  getCourses(): void {
    this.courseService.getAll().subscribe((result) => {
      this.entities = result;
    });
  }

  getProjects(): void {
    this.projectService.getAll().subscribe((result) => {
      this.entities = result;
    });
  }

  subactivitySelected(): void {
    this.entity = undefined;
    if (this.activity === 'Curs') {
      this.getCourses();
    } else {
      this.getProjects();
    }
  }
}
