import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacologicalClassListComponent } from './pharmacological-class-list.component';

describe('PharmacologicalClassListComponent', () => {
  let component: PharmacologicalClassListComponent;
  let fixture: ComponentFixture<PharmacologicalClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacologicalClassListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacologicalClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
