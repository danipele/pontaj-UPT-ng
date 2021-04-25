import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddHolidayForEmployeesDialogComponent } from './add-holiday-for-employees-dialog.component';

describe('AddHolidayForEmployeesDialogComponent', () => {
  let component: AddHolidayForEmployeesDialogComponent;
  let fixture: ComponentFixture<AddHolidayForEmployeesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHolidayForEmployeesDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHolidayForEmployeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
