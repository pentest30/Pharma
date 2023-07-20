import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFormExpeditionComponent } from './op-form-expedition.component';

describe('OpFormExpeditionComponent', () => {
  let component: OpFormExpeditionComponent;
  let fixture: ComponentFixture<OpFormExpeditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpFormExpeditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpFormExpeditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
