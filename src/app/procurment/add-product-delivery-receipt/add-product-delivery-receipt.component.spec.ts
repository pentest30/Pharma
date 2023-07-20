import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductDeliveryReceiptComponent } from './add-product-delivery-receipt.component';

describe('AddProductDeliveryReceiptComponent', () => {
  let component: AddProductDeliveryReceiptComponent;
  let fixture: ComponentFixture<AddProductDeliveryReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductDeliveryReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductDeliveryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
