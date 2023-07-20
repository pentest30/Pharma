import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpConsolidationComponent } from './op-consolidation.component';

describe('OpConsolidationComponent', () => {
  let component: OpConsolidationComponent;
  let fixture: ComponentFixture<OpConsolidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpConsolidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpConsolidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
