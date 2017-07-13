import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpNotiComponent } from './sp-noti.component';

describe('SpNotiComponent', () => {
  let component: SpNotiComponent;
  let fixture: ComponentFixture<SpNotiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpNotiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
