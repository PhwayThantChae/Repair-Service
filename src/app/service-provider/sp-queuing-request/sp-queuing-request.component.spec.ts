import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpQueuingRequestComponent } from './sp-queuing-request.component';

describe('SpQueuingRequestComponent', () => {
  let component: SpQueuingRequestComponent;
  let fixture: ComponentFixture<SpQueuingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpQueuingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpQueuingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
