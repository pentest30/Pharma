import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPendingOrdersComponent } from './all-pending-orders.component';

describe('AllPendingOrdersComponent', () => {
  let component: AllPendingOrdersComponent;
  let fixture: ComponentFixture<AllPendingOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPendingOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPendingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
