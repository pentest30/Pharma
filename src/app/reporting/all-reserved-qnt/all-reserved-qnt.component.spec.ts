import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReservedQntComponent } from './all-reserved-qnt.component';

describe('AllReservedQntComponent', () => {
  let component: AllReservedQntComponent;
  let fixture: ComponentFixture<AllReservedQntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllReservedQntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReservedQntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
