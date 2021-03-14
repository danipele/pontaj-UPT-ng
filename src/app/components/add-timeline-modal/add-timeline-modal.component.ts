import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface Hour {
  displayValue: string;
  value: number;
}

@Component({
  selector: 'app-add-timeline-modal',
  templateUrl: './add-timeline-modal.component.html',
  styleUrls: ['./add-timeline-modal.component.sass']
})
export class AddTimelineModalComponent implements OnInit {
  date: Date;
  selectedStartHour: string;

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

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  cancel(e: any): void {
    e.stopPropagation();
    this.activeModal.dismiss({});
  }

  confirm(e: any): void {
    e.stopPropagation();
    this.activeModal.close({});
  }
}
