import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCourseOverviewComponent } from './enrolled-course-overview.component';

describe('EnrolledCourseOverviewComponent', () => {
  let component: EnrolledCourseOverviewComponent;
  let fixture: ComponentFixture<EnrolledCourseOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolledCourseOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledCourseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
