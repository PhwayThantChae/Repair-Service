import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGetAppointmentComponent } from './user-get-appointment.component';

describe('UserGetAppointmentComponent', () => {
  let component: UserGetAppointmentComponent;
  let fixture: ComponentFixture<UserGetAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGetAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGetAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
