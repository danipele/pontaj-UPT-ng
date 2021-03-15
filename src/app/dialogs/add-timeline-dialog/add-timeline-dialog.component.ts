import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Hour {
  displayValue: string;
  value: number;
}

interface Data {
  date: Date;
}

@Component({
  selector: 'app-add-timeline-dialog',
  templateUrl: './add-timeline-dialog.component.html',
  styleUrls: ['./add-timeline-dialog.component.sass']
})
export class AddTimelineDialogComponent {
  startHour: number;
  endHour: number;
  allDay: boolean;
  activity: string;
  subactivity: string | undefined;

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
  SUBACTIVITIES: string[] = ['Curs', 'Seminar', 'Laborator', 'Proiect', 'Examen'];

  constructor(public dialogRef: MatDialogRef<AddTimelineDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {
    this.startHour = data.date.getHours();
    this.endHour = this.startHour + 1;
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
      startHour: this.startHour,
      endHour: this.endHour,
      allDay: this.allDay,
      activity: this.activity,
      subactivity: this.subactivity
    };
  }

  resetSubactivity(): void {
    this.subactivity = undefined;
  }
}
