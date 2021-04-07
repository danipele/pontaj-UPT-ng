import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { MatTableDataSource } from '@angular/material/table';
import { indexOf } from 'lodash';
import { MatSort, Sort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TimelinesService } from '../../services/timelines.service';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class EventsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() events: MatTableDataSource<IEvent>;
  @Output() filterEvents = new EventEmitter<{
    sort?: string;
    direction?: string;
    subactivity?: string;
    activity?: string;
    start_date_filter?: string;
    end_date_filter?: string;
    all?: boolean;
    course?: number;
    project?: number;
  }>();
  @Output() goToDay = new EventEmitter<{ day: { date: Date } }>();
  @Output() editEvent = new EventEmitter<IEvent>();
  @Output() deleteEvent = new EventEmitter<IEvent>();
  @Input() startDate: Date;
  @Input() isWeekly: boolean;
  @Input() allEvents: boolean | undefined = false;

  ACTIVITIES: string[] = ['Activitate didactica', 'Alta activitate', 'Concediu', 'Proiect'];
  SUBACTIVITIES: string[] = [
    'Absente nemotivate',
    'Alte activitati',
    'Concediu crestere copil',
    'Concediu de maternitate',
    'Concediu de odihna',
    'Concediu fara salariu',
    'Concediu medical',
    'Consultatii',
    'Curs',
    'Documentare oportunitati de finantare proiecte',
    'Documentare pentru cercetare',
    'Elaborare proiecte de cercetare',
    'Evaluare',
    'Executie proiecte de cercetare',
    'Gestiune cooperari',
    'Implicare neremunerată în problematica societății',
    'Indrumare doctoranzi',
    'Laborator',
    'Plecati cu bursa',
    'Pregatire pentru activitatea didactica',
    'Proiect',
    'Seminar',
    'Zile delegatie (Deplasare externa)',
    'Zile delegatie (Deplasare interna)'
  ];

  selectedEvents: IEvent[] = [];
  columnNames: string[] = ['select', 'nr_crt', 'subactivity', 'activity', 'date', 'start', '-', 'end', 'hours', 'edit', 'delete'];

  subactivityFilter = '';
  activityFilter = '';
  startDateFilter?: Date;
  endDateFilter?: Date;

  courseFilter: ICourse;
  projectFilter: IProject;
  courses: ICourse[];
  projects: IProject[];

  constructor(
    public dialog: MatDialog,
    private timelineService: TimelinesService,
    public courseService: CourseService,
    public projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    this.getProjects();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.pipe(tap(() => this.executeFilterEvents())).subscribe();

    this.events.sort = this.sort;

    const sortState: Sort = { active: 'date', direction: 'desc' };
    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit(sortState);
  }

  getCourses(): void {
    this.courseService.getAll().subscribe((result) => (this.courses = result));
  }

  getProjects(): void {
    this.projectService.getAll().subscribe((result) => (this.projects = result));
  }

  executeFilterEvents(): void {
    const params: any = {
      sort: this.sort.active,
      direction: this.sort.direction.toString(),
      subactivity: this.subactivityFilter || '',
      activity: this.activityFilter || '',
      start_date_filter: this.startDateFilter || '',
      end_date_filter: this.endDateFilter || '',
      all: this.allEvents,
      course: this.courseFilter?.id || -1,
      project: this.projectFilter?.id || -1
    };

    this.filterEvents.emit(params);
  }

  checkAll(checked: boolean): void {
    if (checked) {
      this.events.data.forEach((course) => {
        if (!this.selectedEvents.includes(course)) {
          this.selectedEvents.push(course);
        }
      });
    } else {
      this.selectedEvents = [];
    }
  }

  checkEvent(checked: boolean, event: IEvent): void {
    if (checked) {
      this.selectedEvents.push(event);
    } else {
      const index = indexOf(this.selectedEvents, event);
      if (index !== -1) {
        this.selectedEvents.splice(index, 1);
      }
    }
  }

  isEventChecked(event: IEvent): boolean {
    const index = indexOf(this.selectedEvents, event);
    return index !== -1;
  }

  executeGoToDay(event: IEvent): void {
    this.goToDay.emit({ day: { date: event.start } });
  }

  executeEditEvent(event: IEvent): void {
    this.editEvent.emit(event);
  }

  executeDeleteEvent(event: IEvent): void {
    this.deleteEvent.emit(event);
  }

  executeStartDateFilterEvents(event: any): void {
    this.startDateFilter = event.value;
    this.endDateFilter = undefined;
    this.allEvents = true;
    this.executeFilterEvents();
  }

  executeEndDateFilterEvents(event: any): void {
    this.endDateFilter = event.value;
    this.allEvents = true;
    this.executeFilterEvents();
  }

  removeDateFilter(): void {
    this.startDateFilter = undefined;
    this.endDateFilter = undefined;
    this.executeFilterEvents();
  }

  executeGetAllEvents(): void {
    this.allEvents = true;
    this.executeFilterEvents();
  }

  executeGetEvents(): void {
    this.allEvents = false;
    this.executeFilterEvents();
  }

  deleteSelected(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Esti sigur ca vrei sa stergi ' + this.selectedEvents.length + ' inregistrari?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.timelineService.delete_selected(this.selectedEvents).subscribe(() => this.executeFilterEvents());
      }
    });
  }
}
