import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLogListComponent } from './transfer-log-list.component';

describe('TransferLogListComponent', () => {
  let component: TransferLogListComponent;
  let fixture: ComponentFixture<TransferLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferLogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
