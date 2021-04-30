import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import {
  ACTIVITIES,
  COLLABORATOR_SUBACTIVITIES,
  COURSE_SUBACTIVITIES,
  HOLIDAYS,
  IEvent,
  OTHER_SUBACTIVITIES
} from '../../models/event.model';
import { MatTableDataSource } from '@angular/material/table';
import { indexOf } from 'lodash';
import { MatSort, Sort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../helpers/custom-date-adapter';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NotificationHelper } from '../../helpers/notification-helper';
import { TranslateService } from '@ngx-translate/core';
import { LanguageHelper, LocaleIdFactory } from '../../helpers/language-helper';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useFactory: LocaleIdFactory, deps: [LanguageHelper] },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class EventsListComponent implements OnInit, AfterViewInit, OnChanges {
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
    course?: string;
    project?: string;
    for?: string;
  }>();
  @Output() goToDay = new EventEmitter<Date>();
  @Output() editEvent = new EventEmitter<IEvent>();
  @Input() startDate: Date;
  @Input() isWeekly: boolean;
  @Input() allEvents: boolean | undefined = false;
  @Output() copyEvent = new EventEmitter<IEvent>();

  selectedEvents: IEvent[] = [];
  columnNames: string[] = ['select', 'nr_crt', 'subactivity', 'activity', 'date', 'start', '-', 'end', 'hours', 'edit', 'delete', 'copy'];
  expandedEvent: IEvent | null;

  subactivityFilter = '';
  activityFilter = '';
  startDateFilter?: Date;
  endDateFilter?: Date;

  courseFilter: ICourse;
  projectFilter: IProject;
  courses: ICourse[];
  projects: IProject[];

  activities: string[];
  subactivities: string[];

  page = 1;
  displayEvents = new MatTableDataSource<IEvent>();

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    public courseService: CourseService,
    public projectService: ProjectService,
    private notificationHelper: NotificationHelper,
    private translateService: TranslateService
  ) {
    if (this.isEmployee()) {
      this.activities = ACTIVITIES;
      this.subactivities = [...COURSE_SUBACTIVITIES, ...OTHER_SUBACTIVITIES, ...HOLIDAYS].sort((a, b) => a.localeCompare(b));
    } else {
      this.activities = [this.translateService.instant('event.activity.CourseHour')];
      this.subactivities = COLLABORATOR_SUBACTIVITIES;
    }
  }

  ngOnInit(): void {
    this.getCourses();
    this.getProjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.events && (!changes.events.previousValue || changes.events.currentValue.data !== changes.events.previousValue.data)) {
      this.displayEvents = new MatTableDataSource<IEvent>();
      this.page = 1;
      this.setDisplayEvents();
    }
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.pipe(tap(() => this.executeFilterEvents())).subscribe(
      () => {},
      (error) => this.notificationHelper.notifyWithError(error)
    );

    this.events.sort = this.sort;

    const sortState: Sort = { active: 'date', direction: 'desc' };
    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit(sortState);
  }

  getCourses(): void {
    this.courseService.getAll().subscribe(
      (result) => (this.courses = result),
      (error) => this.notificationHelper.notifyWithError(error)
    );
  }

  getProjects(): void {
    this.projectService.getAll().subscribe(
      (result) => (this.projects = result),
      (error) => this.notificationHelper.notifyWithError(error)
    );
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
      course: this.courseFilter?.id || '',
      project: this.projectFilter?.id || '',
      for: this.isWeekly ? 'week' : 'day'
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
    this.goToDay.emit(event.start);
  }

  executeEditEvent(event: IEvent): void {
    this.editEvent.emit(event);
  }

  executeDeleteEvent(event: IEvent): void {
    this.deleteEventAction(event);
  }

  deleteEventAction(event: IEvent): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: this.translateService.instant('message.deleteConfirmation', {
          objectType: this.translateService.instant('message.event')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.eventService.delete(event.id).subscribe(
          () => {
            this.deleteEventFromList(event);
            this.notificationHelper.openNotification(
              this.translateService.instant('message.sg.successfully', {
                objectsType: this.translateService.instant('message.art.event'),
                action: this.translateService.instant('message.sg.deleted')
              }),
              'success'
            );
          },
          (error) => this.notificationHelper.notifyWithError(error)
        );
      }
    });
  }

  deleteEventFromList(event: any): void {
    const index = indexOf(this.events.data, event);
    if (index !== -1) {
      this.events.data.splice(index, 1);
    }
    this.setDisplayEvents();
  }

  executeStartDateFilterEvents(event: any): void {
    if (event) {
      this.startDateFilter = event.value;
      this.endDateFilter = undefined;
      this.allEvents = true;
      this.executeFilterEvents();
    }
  }

  executeEndDateFilterEvents(event: any): void {
    if (event) {
      this.endDateFilter = event.value;
      this.allEvents = true;
      this.executeFilterEvents();
    }
  }

  removeDateFilter(): void {
    this.startDateFilter = undefined;
    this.endDateFilter = undefined;
    this.allEvents = false;
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
        message: this.translateService.instant('message.multipleDeleteConfirmation', {
          nr: this.selectedEvents.length,
          objectsType: this.translateService.instant('message.events')
        }),
        confirmationMessage: this.translateService.instant('action.delete')
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.eventService.deleteSelected(this.selectedEvents).subscribe(
          () => {
            this.executeFilterEvents();
            this.notificationHelper.openNotification(
              this.translateService.instant('message.pl.successfully', {
                nr: this.selectedEvents.length,
                objectsType: this.translateService.instant('message.events'),
                action: this.translateService.instant('message.pl.deleted')
              }),
              'success'
            );
          },
          (error) => this.notificationHelper.notifyWithError(error)
        );
      }
    });
  }

  getEntityDetails(event: IEvent): string {
    if (event.entity) {
      const entity = event.entity;
      if ('faculty' in entity) {
        const course = event.entity as ICourse;
        return this.courseService.getCourseDetails(course);
      } else {
        const project = event.entity as IProject;
        return this.projectService.getProjectDetails(project);
      }
    }
    return '';
  }

  isEmployee(): boolean {
    return JSON.parse(localStorage.getItem('user') as string).type === 'employee';
  }

  executeCopyEvent(event: IEvent): void {
    this.copyEvent.emit(event);
  }

  onScroll(): void {
    if (20 * this.page < this.events.data.length) {
      this.page += 1;
      this.setDisplayEvents();
    }
  }

  setDisplayEvents(): void {
    this.displayEvents = new MatTableDataSource<IEvent>(this.events.data);
  }
}
