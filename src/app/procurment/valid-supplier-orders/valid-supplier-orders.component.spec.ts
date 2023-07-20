import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidSupplierOrdersComponent } from './valid-supplier-orders.component';

describe('ValidSupplierOrdersComponent', () => {
  let component: ValidSupplierOrdersComponent;
  let fixture: ComponentFixture<ValidSupplierOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidSupplierOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidSupplierOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
