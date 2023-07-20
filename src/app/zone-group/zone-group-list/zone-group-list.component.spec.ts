import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneGroupListComponent } from './zone-group-list.component';

describe('ZoneGroupListComponent', () => {
  let component: ZoneGroupListComponent;
  let fixture: ComponentFixture<ZoneGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
