import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpLoginComponent } from './sp-login.component';

describe('SpLoginComponent', () => {
  let component: SpLoginComponent;
  let fixture: ComponentFixture<SpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
