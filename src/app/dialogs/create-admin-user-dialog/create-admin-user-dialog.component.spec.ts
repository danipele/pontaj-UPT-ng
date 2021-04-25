import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAdminUserDialogComponent } from './create-admin-user-dialog.component';

describe('CreateAdminUserDialogComponent', () => {
  let component: CreateAdminUserDialogComponent;
  let fixture: ComponentFixture<CreateAdminUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAdminUserDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
