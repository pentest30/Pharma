import { TestBed } from '@angular/core/testing';

import { DciCodeService } from './dci-code.service';

describe('DciCodeService', () => {
  let service: DciCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DciCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
