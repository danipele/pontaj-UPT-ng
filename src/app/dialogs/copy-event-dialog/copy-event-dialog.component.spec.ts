import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyEventDialogComponent } from './copy-event-dialog.component';

describe('CopyEventDialogComponent', () => {
  let component: CopyEventDialogComponent;
  let fixture: ComponentFixture<CopyEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyEventDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
