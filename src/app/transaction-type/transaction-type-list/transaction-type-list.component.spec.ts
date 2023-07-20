import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeListComponent } from './transaction-type-list.component';

describe('TransactionTypeListComponent', () => {
  let component: TransactionTypeListComponent;
  let fixture: ComponentFixture<TransactionTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
