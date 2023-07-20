import { TestBed } from '@angular/core/testing';

import { PreparationOrdersService } from './preparation-orders.service';

describe('PreparationOrdersService', () => {
  let service: PreparationOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreparationOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
