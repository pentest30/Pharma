import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidSupplierInvoicesComponent } from './valid-supplier-invoices.component';

describe('ValidSupplierInvoicesComponent', () => {
  let component: ValidSupplierInvoicesComponent;
  let fixture: ComponentFixture<ValidSupplierInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidSupplierInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidSupplierInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
