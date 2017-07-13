import { TestBed, inject } from '@angular/core/testing';

import { FirebaseDatabaseService } from './firebase-database.service';

describe('FirebaseDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseDatabaseService]
    });
  });

  it('should ...', inject([FirebaseDatabaseService], (service: FirebaseDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
