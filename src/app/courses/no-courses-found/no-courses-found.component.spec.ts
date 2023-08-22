import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCoursesFoundComponent } from './no-courses-found.component';

describe('NoCoursesFoundComponent', () => {
  let component: NoCoursesFoundComponent;
  let fixture: ComponentFixture<NoCoursesFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCoursesFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCoursesFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
