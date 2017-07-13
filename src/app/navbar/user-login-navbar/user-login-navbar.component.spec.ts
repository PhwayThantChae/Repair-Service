import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginNavbarComponent } from './user-login-navbar.component';

describe('UserLoginNavbarComponent', () => {
  let component: UserLoginNavbarComponent;
  let fixture: ComponentFixture<UserLoginNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLoginNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
