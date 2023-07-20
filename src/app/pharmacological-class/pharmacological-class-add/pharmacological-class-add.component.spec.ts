import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacologicalClassAddComponent } from './pharmacological-class-add.component';

describe('PharmacologicalClassAddComponent', () => {
  let component: PharmacologicalClassAddComponent;
  let fixture: ComponentFixture<PharmacologicalClassAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacologicalClassAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacologicalClassAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
