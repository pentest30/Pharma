import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpAgentsComponent } from './add-op-agents.component';

describe('AddOpAgentsComponent', () => {
  let component: AddOpAgentsComponent;
  let fixture: ComponentFixture<AddOpAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
