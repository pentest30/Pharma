import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryReceiptComponent } from './add-delivery-receipt.component';

describe('AddDeliveryReceiptComponent', () => {
  let component: AddDeliveryReceiptComponent;
  let fixture: ComponentFixture<AddDeliveryReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeliveryReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeliveryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
