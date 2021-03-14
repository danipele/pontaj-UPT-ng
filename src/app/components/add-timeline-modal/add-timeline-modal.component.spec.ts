import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineModalComponent } from './add-timeline-modal.component';

describe('AddTimelineModalComponent', () => {
  let component: AddTimelineModalComponent;
  let fixture: ComponentFixture<AddTimelineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTimelineModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
