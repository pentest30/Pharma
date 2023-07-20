import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTransactionListingComponent } from './financial-transaction-listing.component';

describe('FinancialTransactionListingComponent', () => {
  let component: FinancialTransactionListingComponent;
  let fixture: ComponentFixture<FinancialTransactionListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialTransactionListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialTransactionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
