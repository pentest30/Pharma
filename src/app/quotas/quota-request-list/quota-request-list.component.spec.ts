import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaRequestListComponent } from './quota-request-list.component';

describe('QuotaRequestListComponent', () => {
  let component: QuotaRequestListComponent;
  let fixture: ComponentFixture<QuotaRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
