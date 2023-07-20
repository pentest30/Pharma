import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFormConsolidationComponent } from './op-form-consolidation.component';

describe('OpFormConsolidationComponent', () => {
  let component: OpFormConsolidationComponent;
  let fixture: ComponentFixture<OpFormConsolidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpFormConsolidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpFormConsolidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
