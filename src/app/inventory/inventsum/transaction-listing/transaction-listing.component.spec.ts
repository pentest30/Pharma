import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListingComponent } from './transaction-listing.component';

describe('TransactionListingComponent', () => {
  let component: TransactionListingComponent;
  let fixture: ComponentFixture<TransactionListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
