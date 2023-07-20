import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventListComponent } from './invent-list.component';

describe('InventListComponent', () => {
  let component: InventListComponent;
  let fixture: ComponentFixture<InventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
