import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationOrderDetailComponent } from './preparation-order-detail.component';

describe('PreparationOrderDetailComponent', () => {
  let component: PreparationOrderDetailComponent;
  let fixture: ComponentFixture<PreparationOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparationOrderDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
