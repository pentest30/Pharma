import { TestBed } from '@angular/core/testing';

import { ProductClassService } from './product-class.service';

describe('ProductClassService', () => {
  let service: ProductClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
