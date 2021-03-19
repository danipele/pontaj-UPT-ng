import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditCourseDialogComponent } from './add-edit-course-dialog.component';

describe('AddCourseDialogComponent', () => {
  let component: AddEditCourseDialogComponent;
  let fixture: ComponentFixture<AddEditCourseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCourseDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
