import { TestBed, inject } from '@angular/core/testing';

import { UserdetailssvcService } from './userdetailssvc.service';

describe('UserdetailssvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserdetailssvcService]
    });
  });

  it('should be created', inject([UserdetailssvcService], (service: UserdetailssvcService) => {
    expect(service).toBeTruthy();
  }));
});
