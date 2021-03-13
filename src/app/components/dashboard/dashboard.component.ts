import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  viewDate: Date;
  viewType: string;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.viewDate = new Date();
    this.viewType = 'Lunar';
  }

  ngOnInit(): void {}

  isMonthly(): boolean {
    return this.viewType === 'Lunar';
  }

  isWeekly(): boolean {
    return this.viewType === 'Saptamanal';
  }

  isDaily(): boolean {
    return this.viewType === 'Zilnic';
  }

  setMonthly(): void {
    this.viewType = 'Lunar';
  }

  setWeekly(): void {
    this.viewType = 'Saptamanal';
  }

  setDaily(): void {
    this.viewType = 'Zilnic';
  }

  goBackwards(): void {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);

    this.changeDetectorRef.detectChanges();
  }

  goForwards(): void {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);

    this.changeDetectorRef.detectChanges();
  }
}
