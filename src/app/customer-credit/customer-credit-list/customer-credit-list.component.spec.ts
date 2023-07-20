import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreditListComponent } from './customer-credit-list.component';

describe('CustomerCreditListComponent', () => {
  let component: CustomerCreditListComponent;
  let fixture: ComponentFixture<CustomerCreditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCreditListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
