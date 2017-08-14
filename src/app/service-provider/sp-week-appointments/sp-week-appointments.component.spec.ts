import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpWeekAppointmentsComponent } from './sp-week-appointments.component';

describe('SpWeekAppointmentsComponent', () => {
  let component: SpWeekAppointmentsComponent;
  let fixture: ComponentFixture<SpWeekAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpWeekAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpWeekAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
