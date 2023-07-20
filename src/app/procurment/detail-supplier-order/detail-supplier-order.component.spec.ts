import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSupplierOrderComponent } from './detail-supplier-order.component';

describe('DetailSupplierOrderComponent', () => {
  let component: DetailSupplierOrderComponent;
  let fixture: ComponentFixture<DetailSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSupplierOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
