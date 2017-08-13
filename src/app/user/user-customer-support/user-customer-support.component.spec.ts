import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCustomerSupportComponent } from './user-customer-support.component';

describe('UserCustomerSupportComponent', () => {
  let component: UserCustomerSupportComponent;
  let fixture: ComponentFixture<UserCustomerSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCustomerSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCustomerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
