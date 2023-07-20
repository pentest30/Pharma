import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingZoneListComponent } from './picking-zone-list.component';

describe('PickingZoneListComponent', () => {
  let component: PickingZoneListComponent;
  let fixture: ComponentFixture<PickingZoneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickingZoneListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingZoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
