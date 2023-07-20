import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInvoiceListingComponent } from './supplier-invoice-listing.component';

describe('SupplierInvoiceListingComponent', () => {
  let component: SupplierInvoiceListingComponent;
  let fixture: ComponentFixture<SupplierInvoiceListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierInvoiceListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInvoiceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
