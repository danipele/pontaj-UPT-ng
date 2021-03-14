import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-timeline-modal',
  templateUrl: './add-timeline-modal.component.html',
  styleUrls: ['./add-timeline-modal.component.sass']
})
export class AddTimelineModalComponent implements OnInit {
  date: Date;

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
