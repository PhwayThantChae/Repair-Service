import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchCardComponent } from './user-search-card.component';

describe('UserSearchCardComponent', () => {
  let component: UserSearchCardComponent;
  let fixture: ComponentFixture<UserSearchCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSearchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
