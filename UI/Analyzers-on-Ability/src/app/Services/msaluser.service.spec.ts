import { TestBed, inject } from '@angular/core/testing';

import { MsaluserService } from '../msaluser.service';

describe('MsaluserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsaluserService]
    });
  });

  it('should be created', inject([MsaluserService], (service: MsaluserService) => {
    expect(service).toBeTruthy();
  }));
});
