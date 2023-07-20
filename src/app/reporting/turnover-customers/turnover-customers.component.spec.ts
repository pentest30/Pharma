import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverCustomersComponent } from './turnover-customers.component';

describe('TurnoverCustomersComponent', () => {
  let component: TurnoverCustomersComponent;
  let fixture: ComponentFixture<TurnoverCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnoverCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoverCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
