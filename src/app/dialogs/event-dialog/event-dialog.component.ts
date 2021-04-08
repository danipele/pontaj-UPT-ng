import { Component, Inject, OnInit } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';

interface Data {
  event: IEvent;
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
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  editEvent(): void {
    this.cancel();
    this.calendarEventsHelper.editEventAction(this.data.event);
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
}
