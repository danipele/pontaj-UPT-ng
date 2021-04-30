import { Component, Inject, OnInit } from '@angular/core';
import { COLLABORATOR_SUBACTIVITIES, IEvent } from '../../models/event.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { CourseService } from '../../services/course.service';
import { ProjectService } from '../../services/project.service';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { LanguageHelper } from '../../helpers/language-helper';
import { EventDescriptionHelper } from '../../helpers/event-description-helper';

interface Data {
  event: IEvent;
  resolveEvent: any;
  copyEvent: any;
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
    private languageHelper: LanguageHelper,
    private eventDescriptionHelper: EventDescriptionHelper
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
      case 'courseHour':
        return 'rgb(183, 4, 4)';
      case 'project':
        return 'rgb(29, 119, 29)';
      case 'otherActivity':
        return 'rgb(51, 195, 178)';
      case 'holidays':
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
    this.data.copyEvent(this.data.event);
  }

  getLocaleFromLanguage(): string {
    return this.languageHelper.getLocaleFromLanguage();
  }

  getDescription(): string {
    if (COLLABORATOR_SUBACTIVITIES.includes(this.data.event.subactivity as string)) {
      return this.eventDescriptionHelper.setEventDescriptionText(this.data.event.description as string);
    } else {
      return this.data.event.description as string;
    }
  }
}
