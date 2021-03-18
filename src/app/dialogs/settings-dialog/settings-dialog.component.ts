import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.sass']
})
export class SettingsDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {}
}
