import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpHomepageComponent } from './sp-homepage.component';

describe('SpHomepageComponent', () => {
  let component: SpHomepageComponent;
  let fixture: ComponentFixture<SpHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
