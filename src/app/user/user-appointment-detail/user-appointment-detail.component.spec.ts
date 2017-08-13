import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppointmentDetailComponent } from './user-appointment-detail.component';

describe('UserAppointmentDetailComponent', () => {
  let component: UserAppointmentDetailComponent;
  let fixture: ComponentFixture<UserAppointmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAppointmentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
