import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneGroupAddComponent } from './zone-group-add.component';

describe('ZoneGroupAddComponent', () => {
  let component: ZoneGroupAddComponent;
  let fixture: ComponentFixture<ZoneGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneGroupAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
