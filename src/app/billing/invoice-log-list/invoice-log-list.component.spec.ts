import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLogListComponent } from './invoice-log-list.component';

describe('InvoiceLogListComponent', () => {
  let component: InvoiceLogListComponent;
  let fixture: ComponentFixture<InvoiceLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceLogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
