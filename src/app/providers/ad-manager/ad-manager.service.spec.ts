import { TestBed } from '@angular/core/testing';

import { AdManagerService } from './ad-manager.service';

describe('AdManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdManagerService = TestBed.get(AdManagerService);
    expect(service).toBeTruthy();
  });
});
