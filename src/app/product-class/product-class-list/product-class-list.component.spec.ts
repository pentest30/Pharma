import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClassListComponent } from './product-class-list.component';

describe('ProductClassListComponent', () => {
  let component: ProductClassListComponent;
  let fixture: ComponentFixture<ProductClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductClassListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
