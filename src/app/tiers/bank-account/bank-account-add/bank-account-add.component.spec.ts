import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountAddComponent } from './bank-account-add.component';

describe('BankAccountAddComponent', () => {
  let component: BankAccountAddComponent;
  let fixture: ComponentFixture<BankAccountAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
