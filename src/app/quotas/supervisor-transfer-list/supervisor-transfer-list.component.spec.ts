import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorTransferListComponent } from './supervisor-transfer-list.component';

describe('SupervisorTransferListComponent', () => {
  let component: SupervisorTransferListComponent;
  let fixture: ComponentFixture<SupervisorTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
