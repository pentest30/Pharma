import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosageListComponent } from './dosage-list.component';

describe('DosageListComponent', () => {
  let component: DosageListComponent;
  let fixture: ComponentFixture<DosageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DosageListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
