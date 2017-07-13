import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpNavbarComponent } from './sp-navbar.component';

describe('SpNavbarComponent', () => {
  let component: SpNavbarComponent;
  let fixture: ComponentFixture<SpNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
