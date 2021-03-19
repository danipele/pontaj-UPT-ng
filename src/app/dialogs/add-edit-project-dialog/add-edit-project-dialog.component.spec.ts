import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditProjectDialogComponent } from './add-edit-project-dialog.component';

describe('AddProjectDialogComponent', () => {
  let component: AddEditProjectDialogComponent;
  let fixture: ComponentFixture<AddEditProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditProjectDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
