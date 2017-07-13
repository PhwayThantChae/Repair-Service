import { TestBed, inject } from '@angular/core/testing';

import { ConfirmDeactivateGuardService } from './confirm-deactivate-guard.service';

describe('ConfirmDeactivateGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmDeactivateGuardService]
    });
  });

  it('should ...', inject([ConfirmDeactivateGuardService], (service: ConfirmDeactivateGuardService) => {
    expect(service).toBeTruthy();
  }));
});
