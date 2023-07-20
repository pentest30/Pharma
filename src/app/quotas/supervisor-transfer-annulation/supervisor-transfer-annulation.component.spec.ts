import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorTransferAnnulationComponent } from './supervisor-transfer-annulation.component';

describe('SupervisorTransferAnnulationComponent', () => {
  let component: SupervisorTransferAnnulationComponent;
  let fixture: ComponentFixture<SupervisorTransferAnnulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorTransferAnnulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorTransferAnnulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
