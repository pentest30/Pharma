import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClassAddComponent } from './product-class-add.component';

describe('ProductClassAddComponent', () => {
  let component: ProductClassAddComponent;
  let fixture: ComponentFixture<ProductClassAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductClassAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductClassAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
