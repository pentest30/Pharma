import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeAddComponent } from './transaction-type-add.component';

describe('TransactionTypeAddComponent', () => {
  let component: TransactionTypeAddComponent;
  let fixture: ComponentFixture<TransactionTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTypeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
