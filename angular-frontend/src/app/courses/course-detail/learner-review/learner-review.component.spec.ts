import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerReviewComponent } from './learner-review.component';

describe('LearnerReviewComponent', () => {
  let component: LearnerReviewComponent;
  let fixture: ComponentFixture<LearnerReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnerReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
