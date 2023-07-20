import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosageAddComponent } from './dosage-add.component';

describe('DosageAddComponent', () => {
  let component: DosageAddComponent;
  let fixture: ComponentFixture<DosageAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosageAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
