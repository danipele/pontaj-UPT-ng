import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RECURRENT } from 'src/app/dialogs/add-event-dialog/add-event-dialog.component';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective implements OnInit, OnChanges {
  @Input() recurrent?: RECURRENT;
  @Output() recurrentValue = new EventEmitter<string>();
  @Input() recurrentDate: Date;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => this.formatDate());
  }

  formatDate(): void {
    let formattedValue = '';
    if (this.recurrent === RECURRENT.YEARLY) {
      formattedValue = this.recurrentDate.toLocaleDateString().substring(6);
    } else if (this.recurrent === RECURRENT.MONTHLY) {
      formattedValue = this.recurrentDate.toLocaleDateString().substring(3);
    } else {
      formattedValue = this.recurrentDate.toLocaleDateString();
    }
    this.recurrentValue.emit(formattedValue);
  }
}
