import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDebtListComponent } from './all-debt-list.component';

describe('AllDebtListComponent', () => {
  let component: AllDebtListComponent;
  let fixture: ComponentFixture<AllDebtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDebtListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDebtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
