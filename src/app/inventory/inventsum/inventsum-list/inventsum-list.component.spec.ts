import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventSumListComponent } from './inventsum-list.component';

describe('InventSumListComponent', () => {
  let component: InventSumListComponent;
  let fixture: ComponentFixture<InventSumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventSumListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventSumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
