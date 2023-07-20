import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOrderListingComponent } from './supplier-order-listing.component';

describe('SupplierOrderListingComponent', () => {
  let component: SupplierOrderListingComponent;
  let fixture: ComponentFixture<SupplierOrderListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierOrderListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
