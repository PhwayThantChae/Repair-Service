import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpNotificationsComponent } from './sp-notifications.component';

describe('SpNotificationsComponent', () => {
  let component: SpNotificationsComponent;
  let fixture: ComponentFixture<SpNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
