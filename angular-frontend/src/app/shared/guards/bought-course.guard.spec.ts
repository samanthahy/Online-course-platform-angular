import { TestBed } from '@angular/core/testing';

import { BoughtCourseGuard } from './bought-course.guard';

describe('BoughtCourseGuard', () => {
  let guard: BoughtCourseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BoughtCourseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
