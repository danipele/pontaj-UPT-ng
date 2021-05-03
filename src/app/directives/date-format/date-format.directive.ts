import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective implements OnInit, OnChanges {
  @Input() dateType?: string;
  @Output() setDateValue = new EventEmitter<string>();
  @Input() date: Date;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (this.date) {
        this.formatDate();
      }
    });
  }

  formatDate(): void {
    let formattedValue = '';
    if (this.dateType === 'yearly') {
      formattedValue = this.date.toLocaleDateString().substring(6);
    } else if (this.dateType === 'monthly') {
      formattedValue = this.date.toLocaleDateString().substring(3);
    } else {
      formattedValue = this.date.toLocaleDateString();
    }
    this.setDateValue.emit(formattedValue);
  }
}
