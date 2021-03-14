import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddTimelineModalComponent } from '../components/add-timeline-modal/add-timeline-modal.component';

@Injectable()
export class AddTimelineModalService {
  constructor(private modalService: NgbModal) {}

  open(date: Date): NgbModalRef {
    const modalRef = this.modalService.open(AddTimelineModalComponent, { centered: true });
    modalRef.componentInstance.date = date;
    return modalRef;
  }
}
