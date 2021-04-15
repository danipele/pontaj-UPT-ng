import { Component, Inject, OnInit } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { CopyEventDialogComponent } from '../copy-event-dialog/copy-event-dialog.component';
import { EventService } from '../../services/event.service';

interface Data {
  event: IEvent;
  resolveEvent: any;
  filter: {};
  setEvents: any;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.sass']
})
export class EventDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private calendarEventsHelper: CalendarEventsHelper,
    private courseService: CourseService,
    private projectService: ProjectService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  editEvent(): void {
    this.cancel();
    this.editEventAction(this.data.event);
  }

  editEventAction(event: IEvent): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '40%',
      data: { event, setStartHour: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.resolveEvent(result);
      }
    });
  }

  deleteEvent(): void {
    this.calendarEventsHelper.deleteEventAction(this.data.event);
    this.cancel();
  }

  getIconsColor(): string {
    switch (this.data.event.activity) {
      case 'Activitate didactica':
        return 'rgb(183, 4, 4)';
      case 'Proiect':
        return 'rgb(29, 119, 29)';
      case 'Alta activitate':
        return 'rgb(51, 195, 178)';
      case 'Concediu':
        return 'rgb(90, 37, 236)';
    }
    return '';
  }

  getEntityDetails(): string {
    if (this.data.event.entity) {
      const entity = this.data.event.entity;
      if ('faculty' in entity) {
        const course = this.data.event.entity as ICourse;
        return this.courseService.getCourseDetails(course);
      } else {
        const project = this.data.event.entity as IProject;
        return this.projectService.getProjectDetails(project);
      }
    }
    return '';
  }

  copyEvent(): void {
    this.cancel();
    const endHour = this.data.event.end.getHours();
    const dialogRef = this.dialog.open(CopyEventDialogComponent, {
      width: '40%',
      data: { eventLength: (endHour === 0 ? 24 : endHour) - this.data.event.start.getHours() }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const start = new Date(result.date);
        start.setHours(result.startHour);
        const end = new Date(result.date);
        end.setHours(result.startHour + (endHour === 0 ? 24 : endHour) - this.data.event.start.getHours());
        const event = this.data.event;

        const eventData: any = {
          start_date: start,
          end_date: end,
          activity: event.activity,
          subactivity: event.subactivity,
          entity: event.entity ? event.entity.id : undefined,
          description: event.description
        };
        this.eventService.add({ ...eventData, filter: this.data.filter }).subscribe((events) => {
          const resolvedEvents = this.calendarEventsHelper.addEvents(events);
          this.data.setEvents(resolvedEvents);
        });
      }
    });
  }
}
