import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaTransferComponent } from './quota-transfer.component';

describe('QuotaTransferComponent', () => {
  let component: QuotaTransferComponent;
  let fixture: ComponentFixture<QuotaTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
