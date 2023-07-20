import { TestBed } from '@angular/core/testing';

import { ZoneGroupService } from './zone-group.service';

describe('ZoneGroupService', () => {
  let service: ZoneGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
