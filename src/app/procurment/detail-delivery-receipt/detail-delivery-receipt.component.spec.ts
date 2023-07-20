import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDeliveryReceiptComponent } from './detail-delivery-receipt.component';

describe('DetailDeliveryReceiptComponent', () => {
  let component: DetailDeliveryReceiptComponent;
  let fixture: ComponentFixture<DetailDeliveryReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDeliveryReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDeliveryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
