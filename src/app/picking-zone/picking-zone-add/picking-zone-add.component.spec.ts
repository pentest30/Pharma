import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingZoneAddComponent } from './picking-zone-add.component';

describe('PickingZoneAddComponent', () => {
  let component: PickingZoneAddComponent;
  let fixture: ComponentFixture<PickingZoneAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickingZoneAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingZoneAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
