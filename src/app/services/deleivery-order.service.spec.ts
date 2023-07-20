import { TestBed } from '@angular/core/testing';

import { DeleiveryOrderService } from './deleivery-order.service';

describe('DeleiveryOrderService', () => {
  let service: DeleiveryOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleiveryOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
