import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfetLogAddComponent } from './transfet-log-add.component';

describe('TransfetLogAddComponent', () => {
  let component: TransfetLogAddComponent;
  let fixture: ComponentFixture<TransfetLogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfetLogAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfetLogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
