import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerformanceComponent } from './admin-performance.component';

describe('AdminPerformanceComponent', () => {
  let component: AdminPerformanceComponent;
  let fixture: ComponentFixture<AdminPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
