import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersListDtComponent } from './orders-list-dt.component';

describe('OrdersListDtComponent', () => {
  let component: OrdersListDtComponent;
  let fixture: ComponentFixture<OrdersListDtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersListDtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersListDtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
