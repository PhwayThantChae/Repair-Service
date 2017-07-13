import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotiComponent } from './user-noti.component';

describe('UserNotiComponent', () => {
  let component: UserNotiComponent;
  let fixture: ComponentFixture<UserNotiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNotiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
