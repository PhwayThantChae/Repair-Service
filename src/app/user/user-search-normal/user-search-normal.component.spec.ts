import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchNormalComponent } from './user-search-normal.component';

describe('UserSearchNormalComponent', () => {
  let component: UserSearchNormalComponent;
  let fixture: ComponentFixture<UserSearchNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSearchNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
