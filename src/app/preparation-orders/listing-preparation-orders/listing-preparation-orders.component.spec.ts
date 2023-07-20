import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingPreparationOrdersComponent } from './listing-preparation-orders.component';

describe('ListingPreparationOrdersComponent', () => {
  let component: ListingPreparationOrdersComponent;
  let fixture: ComponentFixture<ListingPreparationOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingPreparationOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingPreparationOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
