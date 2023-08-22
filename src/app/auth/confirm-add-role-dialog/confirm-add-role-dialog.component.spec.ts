import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddRoleDialogComponent } from './confirm-add-role-dialog.component';

describe('ConfirmAddRoalDialogComponent', () => {
  let component: ConfirmAddRoleDialogComponent;
  let fixture: ComponentFixture<ConfirmAddRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAddRoleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAddRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
