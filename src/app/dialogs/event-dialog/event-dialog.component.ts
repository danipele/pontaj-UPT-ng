import { Component, Inject, OnInit } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICourse } from '../../models/course.model';
import { IProject } from '../../models/project.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TimelinesService } from '../../services/timelines.service';
import { CalendarEventsHelper } from '../../helpers/calendar-events-helper';
import { AddTimelineDialogComponent } from '../add-timeline-dialog/add-timeline-dialog.component';

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
    private timelineService: TimelinesService
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  editEvent(): void {
    this.cancel();
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '40%',
      data: {
        event: this.data.event
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarEventsHelper.resolveEvent(result);
      }
    });
  }

  deleteEvent(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Esti sigur ca vrei sa stergi aceasta inregistrare?',
        confirmationMessage: 'Sterge'
      }
    });

    dialogRef.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.timelineService.delete(this.data.event.id).subscribe(() => {
          this.calendarEventsHelper.deleteEvent(this.data.event);
          this.cancel();
        });
      }
    });
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
        return `${course.name} ∙ ${course.faculty} ∙ ${course.cycle} ∙ Anul ${course.student_year} ∙ Semestrul ${course.semester} ∙ ${course.description}`;
      } else {
        const project = this.data.event.entity as IProject;
        return `${project.name} ∙ ${project.description}`;
      }
    }
    return '';
  }
}
