import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductListComponent } from './detail-product-list.component';

describe('DetailProductListComponent', () => {
  let component: DetailProductListComponent;
  let fixture: ComponentFixture<DetailProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
