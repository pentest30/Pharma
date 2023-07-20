import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaRequestValidationComponent } from './quota-request-validation.component';

describe('QuotaRequestValidationComponent', () => {
  let component: QuotaRequestValidationComponent;
  let fixture: ComponentFixture<QuotaRequestValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaRequestValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaRequestValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
