import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSalesLogComponent } from './products-sales-log.component';

describe('ProductsSalesLogComponent', () => {
  let component: ProductsSalesLogComponent;
  let fixture: ComponentFixture<ProductsSalesLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsSalesLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSalesLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
