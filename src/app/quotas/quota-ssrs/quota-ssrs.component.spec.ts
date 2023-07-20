import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaSsrsComponent } from './quota-ssrs.component';

describe('QuotaSsrsComponent', () => {
  let component: QuotaSsrsComponent;
  let fixture: ComponentFixture<QuotaSsrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaSsrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaSsrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
