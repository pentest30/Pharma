import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreditDetailComponent } from './customer-credit-detail.component';

describe('CustomerCreditDetailComponent', () => {
  let component: CustomerCreditDetailComponent;
  let fixture: ComponentFixture<CustomerCreditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCreditDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCreditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
