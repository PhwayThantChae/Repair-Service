import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSpProfileComponent } from './user-sp-profile.component';

describe('UserSpProfileComponent', () => {
  let component: UserSpProfileComponent;
  let fixture: ComponentFixture<UserSpProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSpProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
