import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleiveryOrderListingComponent } from './deleivery-order-listing.component';

describe('DeleiveryOrderListingComponent', () => {
  let component: DeleiveryOrderListingComponent;
  let fixture: ComponentFixture<DeleiveryOrderListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleiveryOrderListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleiveryOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
