import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingEmployeeComponent } from './listing-employee.component';

describe('ListingEmployeeComponent', () => {
  let component: ListingEmployeeComponent;
  let fixture: ComponentFixture<ListingEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
