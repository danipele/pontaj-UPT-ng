import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyEventsDialogComponent } from './copy-events-dialog.component';

describe('CopyEventsDialogComponent', () => {
  let component: CopyEventsDialogComponent;
  let fixture: ComponentFixture<CopyEventsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyEventsDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyEventsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
