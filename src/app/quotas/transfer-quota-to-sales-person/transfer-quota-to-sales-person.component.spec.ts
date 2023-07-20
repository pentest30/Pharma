import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferQuotaToSalesPersonComponent } from './transfer-quota-to-sales-person.component';

describe('TransferQuotaToSalesPersonComponent', () => {
  let component: TransferQuotaToSalesPersonComponent;
  let fixture: ComponentFixture<TransferQuotaToSalesPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferQuotaToSalesPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferQuotaToSalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
