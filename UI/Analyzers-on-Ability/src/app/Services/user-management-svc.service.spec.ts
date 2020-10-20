import { TestBed, inject } from '@angular/core/testing';

import { UserManagementSvcService } from './user-management-svc.service';

describe('UserManagementSvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserManagementSvcService]
    });
  });

  it('should be created', inject([UserManagementSvcService], (service: UserManagementSvcService) => {
    expect(service).toBeTruthy();
  }));
});
