import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestedAppointmentDetailsComponent } from './user-requested-appointment-details.component';

describe('UserRequestedAppointmentDetailsComponent', () => {
  let component: UserRequestedAppointmentDetailsComponent;
  let fixture: ComponentFixture<UserRequestedAppointmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequestedAppointmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequestedAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
