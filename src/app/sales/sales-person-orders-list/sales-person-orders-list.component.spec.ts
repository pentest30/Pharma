import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPersonOrdersListComponent } from './sales-person-orders-list.component';

describe('SalesPersonOrdersListComponent', () => {
  let component: SalesPersonOrdersListComponent;
  let fixture: ComponentFixture<SalesPersonOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPersonOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPersonOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
