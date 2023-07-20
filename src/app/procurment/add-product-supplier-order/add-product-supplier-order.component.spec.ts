import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductSupplierOrderComponent } from './add-product-supplier-order.component';

describe('AddProductSupplierOrderComponent', () => {
  let component: AddProductSupplierOrderComponent;
  let fixture: ComponentFixture<AddProductSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductSupplierOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
