import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeviceModalComponent } from './user-device-modal.component';

describe('UserDeviceModalComponent', () => {
  let component: UserDeviceModalComponent;
  let fixture: ComponentFixture<UserDeviceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeviceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeviceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
