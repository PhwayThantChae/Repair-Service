import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCustomerSupportComponent } from './sp-customer-support.component';

describe('SpCustomerSupportComponent', () => {
  let component: SpCustomerSupportComponent;
  let fixture: ComponentFixture<SpCustomerSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpCustomerSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpCustomerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
