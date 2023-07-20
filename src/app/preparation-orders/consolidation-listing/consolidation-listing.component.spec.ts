import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidationListingComponent } from './consolidation-listing.component';

describe('ConsolidationListingComponent', () => {
  let component: ConsolidationListingComponent;
  let fixture: ComponentFixture<ConsolidationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidationListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
