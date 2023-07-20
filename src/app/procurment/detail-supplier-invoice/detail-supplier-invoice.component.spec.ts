import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSupplierInvoiceComponent } from './detail-supplier-invoice.component';

describe('DetailSupplierInvoiceComponent', () => {
  let component: DetailSupplierInvoiceComponent;
  let fixture: ComponentFixture<DetailSupplierInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSupplierInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSupplierInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
