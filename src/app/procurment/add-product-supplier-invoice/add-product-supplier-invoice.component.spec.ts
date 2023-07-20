import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductSupplierInvoiceComponent } from './add-product-supplier-invoice.component';

describe('AddProductSupplierInvoiceComponent', () => {
  let component: AddProductSupplierInvoiceComponent;
  let fixture: ComponentFixture<AddProductSupplierInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductSupplierInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductSupplierInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
