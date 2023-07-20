import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionListingComponent } from './expedition-listing.component';

describe('ExpeditionListingComponent', () => {
  let component: ExpeditionListingComponent;
  let fixture: ComponentFixture<ExpeditionListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpeditionListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
