import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestedServiceComponent } from './user-requested-service.component';

describe('UserRequestedServiceComponent', () => {
  let component: UserRequestedServiceComponent;
  let fixture: ComponentFixture<UserRequestedServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequestedServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequestedServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
