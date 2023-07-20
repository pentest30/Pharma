import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxGroupAddComponent } from './tax-group-add.component';

describe('TaxGroupAddComponent', () => {
  let component: TaxGroupAddComponent;
  let fixture: ComponentFixture<TaxGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxGroupAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
