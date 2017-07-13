import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpApprovedRequestComponent } from './sp-approved-request.component';

describe('SpApprovedRequestComponent', () => {
  let component: SpApprovedRequestComponent;
  let fixture: ComponentFixture<SpApprovedRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpApprovedRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpApprovedRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
