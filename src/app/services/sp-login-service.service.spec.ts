import { TestBed, inject } from '@angular/core/testing';

import { SpLoginServiceService } from './sp-login-service.service';

describe('SpLoginServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpLoginServiceService]
    });
  });

  it('should ...', inject([SpLoginServiceService], (service: SpLoginServiceService) => {
    expect(service).toBeTruthy();
  }));
});
