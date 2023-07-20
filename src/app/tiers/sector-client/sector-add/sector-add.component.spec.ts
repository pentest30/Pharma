import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorAddComponent } from './sector-add.component';

describe('SectorAddComponent', () => {
  let component: SectorAddComponent;
  let fixture: ComponentFixture<SectorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
