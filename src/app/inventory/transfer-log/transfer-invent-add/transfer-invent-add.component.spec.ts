import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferInventAddComponent } from './transfer-invent-add.component';

describe('TransferInventAddComponent', () => {
  let component: TransferInventAddComponent;
  let fixture: ComponentFixture<TransferInventAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferInventAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferInventAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
