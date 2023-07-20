import { TestBed } from '@angular/core/testing';

import { PikingZoneService } from './piking-zone.service';

describe('PikingZoneService', () => {
  let service: PikingZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PikingZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
