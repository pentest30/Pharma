import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorTransfertComponent } from './supervisor-transfert.component';

describe('SupervisorTransfertComponent', () => {
  let component: SupervisorTransfertComponent;
  let fixture: ComponentFixture<SupervisorTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorTransfertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
