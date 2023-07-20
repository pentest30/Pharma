import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaReceivedListComponent } from './quota-received-list.component';

describe('QuotaReceivedListComponent', () => {
  let component: QuotaReceivedListComponent;
  let fixture: ComponentFixture<QuotaReceivedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaReceivedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaReceivedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
