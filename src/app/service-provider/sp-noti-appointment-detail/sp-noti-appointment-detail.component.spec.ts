import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpAppointmentDetailComponent } from './sp-noti-appointment-detail.component';

describe('SpAppointmentDetailComponent', () => {
  let component: SpAppointmentDetailComponent;
  let fixture: ComponentFixture<SpAppointmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpAppointmentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpAppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
