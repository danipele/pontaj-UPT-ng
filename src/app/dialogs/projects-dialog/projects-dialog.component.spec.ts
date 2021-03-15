import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsDialogComponent } from './projects-dialog.component';

describe('ProjectsDialogComponent', () => {
  let component: ProjectsDialogComponent;
  let fixture: ComponentFixture<ProjectsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
