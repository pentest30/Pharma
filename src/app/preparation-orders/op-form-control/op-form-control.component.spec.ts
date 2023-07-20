import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFormControlComponent } from './op-form-control.component';

describe('OpFormControlComponent', () => {
  let component: OpFormControlComponent;
  let fixture: ComponentFixture<OpFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
