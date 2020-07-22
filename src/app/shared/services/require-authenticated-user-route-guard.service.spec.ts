import { TestBed } from '@angular/core/testing';

import { RequireAuthenticatedUserRouteGuardService } from './require-authenticated-user-route-guard.service';

describe('RequireAuthenticatedUserRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequireAuthenticatedUserRouteGuardService = TestBed.get(RequireAuthenticatedUserRouteGuardService);
    expect(service).toBeTruthy();
  });
});
