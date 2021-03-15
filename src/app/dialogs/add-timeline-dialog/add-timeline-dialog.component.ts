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
  selectedStartHour: number;
  selectedEndHour: number;
  allDay: boolean;

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

  constructor(public dialogRef: MatDialogRef<AddTimelineDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {
    this.selectedStartHour = data.date.getHours();
    this.selectedEndHour = this.selectedStartHour + 1;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  startHours(): Hour[] {
    return this.HOURS.slice(0, this.HOURS.length - 1);
  }

  endHours(): Hour[] {
    return this.HOURS.slice(this.selectedStartHour - 7, this.HOURS.length);
  }

  setAllDay(event: any): void {
    this.allDay = event;
  }
}
