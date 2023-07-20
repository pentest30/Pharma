import { TestBed } from '@angular/core/testing';

import { CustomerCreditService } from './customer-credit.service';

describe('CustomerCreditService', () => {
  let service: CustomerCreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerCreditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
