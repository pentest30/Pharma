import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerAddComponent } from './manufacturer-add.component';

describe('ManufacturerAddComponent', () => {
  let component: ManufacturerAddComponent;
  let fixture: ComponentFixture<ManufacturerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturerAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
