import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDebtDetailsComponent } from './invoice-debt-details.component';

describe('InvoiceDebtDetailsComponent', () => {
  let component: InvoiceDebtDetailsComponent;
  let fixture: ComponentFixture<InvoiceDebtDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDebtDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDebtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
