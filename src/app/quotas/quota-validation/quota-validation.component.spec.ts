import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaValidationComponent } from './quota-validation.component';

describe('QuotaValidationComponent', () => {
  let component: QuotaValidationComponent;
  let fixture: ComponentFixture<QuotaValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
