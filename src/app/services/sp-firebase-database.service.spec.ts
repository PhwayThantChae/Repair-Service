import { TestBed, inject } from '@angular/core/testing';

import { SpFirebaseDatabaseService } from './sp-firebase-database.service';

describe('SpFirebaseDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpFirebaseDatabaseService]
    });
  });

  it('should ...', inject([SpFirebaseDatabaseService], (service: SpFirebaseDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
