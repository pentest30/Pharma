import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerCreditComponent } from './add-customer-credit.component';

describe('AddCustomerCreditComponent', () => {
  let component: AddCustomerCreditComponent;
  let fixture: ComponentFixture<AddCustomerCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
