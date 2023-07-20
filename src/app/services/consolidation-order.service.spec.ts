import { TestBed } from '@angular/core/testing';

import { ConsolidationOrderService } from './consolidation-order.service';

describe('ConsolidationOrderService', () => {
  let service: ConsolidationOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolidationOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
