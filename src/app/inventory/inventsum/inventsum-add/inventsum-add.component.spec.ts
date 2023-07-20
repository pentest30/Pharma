import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventSumAddComponent } from './inventsum-add.component';

describe('InventSumAddComponent', () => {
  let component: InventSumAddComponent;
  let fixture: ComponentFixture<InventSumAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventSumAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventSumAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
