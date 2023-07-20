import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaResuqetByProductsComponent } from './quota-resuqet-by-products.component';

describe('QuotaResuqetByProductsComponent', () => {
  let component: QuotaResuqetByProductsComponent;
  let fixture: ComponentFixture<QuotaResuqetByProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaResuqetByProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaResuqetByProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
