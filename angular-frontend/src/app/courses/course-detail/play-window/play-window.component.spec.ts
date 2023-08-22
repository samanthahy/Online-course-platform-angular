import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayWindowComponent } from './play-window.component';

describe('PlayWindowComponent', () => {
  let component: PlayWindowComponent;
  let fixture: ComponentFixture<PlayWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
