import { Component, Inject, OnInit } from '@angular/core';
import { IEvent } from '../../models/event.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Data {
  event: IEvent;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.sass']
})
export class EventDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<EventDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}
