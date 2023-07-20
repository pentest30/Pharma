import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryReceiptListingComponent } from './delivery-receipt-listing.component';

describe('DeliveryReceiptListingComponent', () => {
  let component: DeliveryReceiptListingComponent;
  let fixture: ComponentFixture<DeliveryReceiptListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryReceiptListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryReceiptListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
