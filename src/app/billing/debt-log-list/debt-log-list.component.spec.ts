import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtLogListComponent } from './debt-log-list.component';

describe('DebtLogListComponent', () => {
  let component: DebtLogListComponent;
  let fixture: ComponentFixture<DebtLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtLogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
